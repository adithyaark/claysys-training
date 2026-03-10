import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import {
  ReactiveFormsModule, FormBuilder, FormGroup,
  FormArray, Validators, AbstractControl, ValidationErrors, FormControl
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription, Observable, firstValueFrom } from 'rxjs';
import { DataService, Course, Quiz, Question, QuizResult } from '../../services/data.service';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

// Custom validator — all 4 options must be filled
function allOptionsFilled(ctrl: AbstractControl): ValidationErrors | null {
  const arr = ctrl as FormArray;
  const filled = arr.controls.filter(c => c.value?.trim()).length;
  return filled < 4 ? { optionsIncomplete: true } : null;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public data = inject(DataService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  activeTab: 'dashboard' | 'questions' | 'leaderboard' = 'questions'; // Default to questions as per user focus
  isEditing = false;
  editingId: number | null = null;
  isSubmitting = false;
  isLoadingQuestions = false;

  // Dashboard stats
  qCount = 0;
  quizzesTaken = 0;

  // Questions filter
  filterQuizId: string = 'all';
  courses: Course[] = [];
  quizzes: Quiz[] = [];
  allQuestions: Question[] = [];
  filteredQuestions: Question[] = [];

  // Leaderboard
  leaderboard: QuizResult[] = [];

  private subs: Subscription[] = [];
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      quizId: [null, Validators.required],
      text: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(300),
      ]],
      options: this.fb.array([
        this.fb.control('', [Validators.required, Validators.maxLength(100)]),
        this.fb.control('', [Validators.required, Validators.maxLength(100)]),
        this.fb.control('', [Validators.required, Validators.maxLength(100)]),
        this.fb.control('', [Validators.required, Validators.maxLength(100)]),
      ], { validators: allOptionsFilled }),
      correctAnswer: [null, [Validators.required]], // Expecting "A", "B", "C", "D"
      points: [1, [Validators.required, Validators.min(1)]],
      isCustom: [true]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  async loadData() {
    try {
      // 1. Fetch metadata first
      const [courses, quizzes] = await Promise.all([
        firstValueFrom(this.data.getCourses()),
        firstValueFrom(this.data.getQuizzes())
      ]);

      this.courses = courses || [];
      this.quizzes = quizzes || [];
      this.qCount = this.quizzes.reduce((acc, q) => acc + (q.questionCount || 0), 0);
      
      this.cdr.detectChanges();

      // 2. Fetch questions immediately after metadata is ready
      await this.onQuizFilterChange();

      // 3. Load leaderboard in background
      this.data.getAllResults().subscribe({
        next: (res) => {
          this.leaderboard = res;
          this.quizzesTaken = res.length;
          this.cdr.detectChanges();
        }
      });
    } catch (err) {
      console.error('Admin initialization failed:', err);
      this.toast.show('Failed to connect to the server.');
    } finally {
      this.cdr.detectChanges();
    }
  }

  get options(): FormArray { return this.form.get('options') as FormArray; }

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  async onQuizFilterChange() {
    this.isLoadingQuestions = true;
    this.cdr.detectChanges();

    try {
      // Ensure we have a token before proceeding, or retry briefly
      if (!this.auth.token) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief wait for token persistence
      }

      if (this.filterQuizId === 'all') {
        const questions = await firstValueFrom(this.data.getAllQuestionsWithAnswers());
        this.filteredQuestions = questions || [];
      } else {
        const id = Number(this.filterQuizId);
        const questions = await firstValueFrom(this.data.getQuestionsByQuizWithAnswers(id));
        this.filteredQuestions = questions || [];
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
      this.toast.show('Error loading questions list.');
    } finally {
      this.isLoadingQuestions = false;
      this.cdr.detectChanges();
    }
  }

  getCourseName(quizId: any): string {
    if (!this.quizzes || this.quizzes.length === 0) return 'Loading...';
    const id = Number(quizId);
    const quiz = this.quizzes.find(q => q.id === id);
    return quiz ? quiz.courseName : 'System';
  }

  switchTab(tab: 'dashboard' | 'questions' | 'leaderboard') {
    this.activeTab = tab;
    if (tab === 'questions') {
      this.onQuizFilterChange();
    }
    this.cdr.detectChanges();
  }

  showError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  getFieldError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required'])  return 'This field is required.';
    if (c.errors['minlength']) return `Min ${c.errors['minlength'].requiredLength} characters.`;
    if (c.errors['maxlength']) return `Max ${c.errors['maxlength'].requiredLength} characters.`;
    return '';
  }

  async saveQuestion() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.isSubmitting = true;

    const val = this.form.value;
    const dto = {
      text: val.text,
      optionA: val.options[0],
      optionB: val.options[1],
      optionC: val.options[2],
      optionD: val.options[3],
      correctAnswer: val.correctAnswer,
      points: Number(val.points),
      quizId: Number(val.quizId),
      isCustom: !!val.isCustom
    };

    console.log('Saving DTO:', dto);

    try {
      if (this.isEditing && this.editingId) {
        await firstValueFrom(this.data.updateQuestion(this.editingId, dto));
        this.toast.show('Question updated!');
      } else {
        await firstValueFrom(this.data.addQuestion(dto));
        this.toast.show('Question added!');
      }
      this.resetForm();
      await this.onQuizFilterChange(); // Refresh list
    } catch (e: any) {
      console.error('Save failed:', e);
      const msg = e.error?.message || 'Error saving question.';
      this.toast.show(msg);
    } finally {
      this.isSubmitting = false;
    }
  }

  editQuestion(q: Question) {
    this.isEditing = true;
    this.editingId = q.id;
    this.switchTab('questions');
    this.form.patchValue({
      quizId: q.quizId,
      text: q.text,
      correctAnswer: q.correctAnswer,
      points: q.points,
      isCustom: q.isCustom
    });
    this.options.at(0).setValue(q.optionA);
    this.options.at(1).setValue(q.optionB);
    this.options.at(2).setValue(q.optionC);
    this.options.at(3).setValue(q.optionD);
    
    setTimeout(() => {
      document.querySelector('.form-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  async deleteQuestion(id: number) {
    if (!confirm('Delete this question?')) return;
    try {
      await firstValueFrom(this.data.deleteQuestion(id));
      this.toast.show('Question deleted.');
      this.onQuizFilterChange();
    } catch (err) {
      this.toast.show('Failed to delete question');
    }
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = null;
    this.form.reset({ points: 1, isCustom: true });
  }
}
