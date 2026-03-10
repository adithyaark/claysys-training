import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { APP_CONFIG } from '../../app.constants';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { DataService, Course, Quiz } from '../../services/data.service';
import { QuizStateService } from '../../services/quiz-state';
import { ToastService } from '../../services/toast';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private data = inject(DataService);
  private state = inject(QuizStateService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(AuthService);

  courses: Course[] = [];
  quizzes: Record<number, Quiz[]> = {};
  selectedCourseId: number | null = null;
  loading = false;
  error: string | null = null;
  
  nameControls: Record<number, FormControl> = {};

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = null;

    console.log('Home: Requesting courses from', APP_CONFIG.apiBaseUrl);

    // Safety timeout: stop loading after 10s even if browser hangs
    const safetyTimer = setTimeout(() => {
      if (this.loading && this.courses.length === 0) {
        console.warn('Home: Data fetch timed out after 10s');
        this.loading = false;
        this.error = 'The request is taking too long. Please check your network or refresh the page.';
      }
    }, 10000);

    this.data.getCourses().subscribe({
      next: (data) => {
        clearTimeout(safetyTimer);
        this.courses = Array.isArray(data) ? data : [];
        this.loading = false;
        
        const registeredName = this.auth.currentUser?.username || '';

        for (const course of this.courses) {
          this.nameControls[course.id] = new FormControl(registeredName, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(30),
            Validators.pattern(/^[a-zA-Z\s'.-]+$/),
          ]);
          
          this.data.getQuizzesByCourse(course.id).subscribe({
            next: (quizList) => {
              this.quizzes[course.id] = quizList;
            },
            error: (err) => {
              console.warn(`Home: Quiz load error for ${course.id}`, err);
              this.quizzes[course.id] = [];
            }
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        clearTimeout(safetyTimer);
        console.error('Home: loadData error', err);
        this.loading = false;
        this.error = `Connection failed: ${err.message || 'Unknown error'}. Check if C# API is running.`;
        this.toast.show('Failed to load courses');
      }
    });
  }

  pick(id: number) { 
    this.selectedCourseId = id; 
  }

  getError(courseId: number): string {
    const ctrl = this.nameControls[courseId];
    if (!ctrl || !ctrl.touched) return '';
    if (ctrl.hasError('required'))  return 'Name is required.';
    if (ctrl.hasError('minlength')) return 'Name must be at least 2 characters.';
    if (ctrl.hasError('maxlength')) return 'Name must be under 30 characters.';
    if (ctrl.hasError('pattern'))   return 'Only letters, spaces and hyphens allowed.';
    return '';
  }

  async start(course: Course) {
    try {
      const ctrl = this.nameControls[course.id];
      if (!ctrl) {
        this.toast.show('Initialization error. Please refresh.');
        return;
      }

      ctrl.markAsTouched();
      if (ctrl.invalid) return;

      const registeredUser = this.auth.currentUser?.username;
      const enteredName = ctrl.value.trim();

      if (enteredName !== registeredUser) {
        this.toast.show(`Name must match your username: ${registeredUser}`);
        return;
      }

      const courseQuizzes = this.quizzes[course.id];
      if (!courseQuizzes || courseQuizzes.length === 0) {
        this.toast.show('No quizzes available for this course');
        return;
      }

      const quiz = courseQuizzes[0];
      
      this.loading = true;
      try {
        const questions = await firstValueFrom(this.data.getQuestionsByQuiz(quiz.id));
        
        if (questions.length === 0) {
          this.toast.show('This quiz has no questions yet.');
          return;
        }

        this.state.course = course;
        this.state.quizId = quiz.id;
        this.state.userName = ctrl.value.trim();
        this.state.questions = this.state.shuffle(questions);
        this.state.currentQ = 0;
        this.state.answers = new Array(questions.length).fill(null);

        this.router.navigate(['/quiz']);
      } catch (err) {
        console.error('Home: Failed to fetch questions', err);
        this.toast.show('Failed to load quiz questions');
      } finally {
        this.loading = false;
      }
    } catch (criticalErr) {
      console.error('Home: CRITICAL ERROR in start()', criticalErr);
      this.toast.show('A technical error occurred.');
    }
  }
}