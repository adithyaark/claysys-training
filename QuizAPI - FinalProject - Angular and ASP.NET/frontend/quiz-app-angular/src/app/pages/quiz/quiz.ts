import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { QuizStateService } from '../../services/quiz-state';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class QuizComponent implements OnInit, OnDestroy {
  public state = inject(QuizStateService);
  public data = inject(DataService);
  private router = inject(Router);
  private toast = inject(ToastService);

  timeLeft = 600;
  private timerId: any;
  labels = ['A','B','C','D'];

  ngOnInit() {
    if (!this.state.isReady) { 
      this.router.navigate(['/']); 
      return; 
    }
    this.tick();
  }

  ngOnDestroy() { 
    clearTimeout(this.timerId); 
  }

  get q()        { return this.state.questions[this.state.currentQ]; }
  get num()      { return this.state.currentQ + 1; }
  get total()    { return this.state.questions.length; }
  get pct()      { return Math.round((this.num / this.total) * 100); }
  get answered() { return this.state.answers[this.state.currentQ] !== null; }
  get isLast()   { return this.state.currentQ === this.total - 1; }
  get timerMin() { return String(Math.floor(this.timeLeft/60)).padStart(2,'0'); }
  get timerSec() { return String(this.timeLeft % 60).padStart(2,'0'); }

  get timerClass() {
    return this.timeLeft < 60  ? 'prog-timer danger'  :
           this.timeLeft < 300 ? 'prog-timer warning' : 'prog-timer';
  }

  optClass(label: string): string {
    if (!this.answered) return 'opt';
    const selected = this.state.answers[this.state.currentQ];
    const correct = this.q.correctAnswer;
    
    if (label === correct) return 'opt correct';
    if (label === selected) return 'opt wrong';
    return 'opt';
  }

  answer(label: string) {
    if (this.answered) return;
    this.state.answers[this.state.currentQ] = label;
  }

  next() {
    if (!this.isLast) { 
      this.state.currentQ++; 
    } else { 
      this.finish(); 
    }
  }

  async finish() {
    clearTimeout(this.timerId);
    
    // Prepare answers for submission
    const submission = this.state.questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: this.state.answers[i] || ''
    }));

    try {
      if (this.state.quizId) {
        const result = await firstValueFrom(this.data.submitQuiz(this.state.quizId, submission));
        this.state.lastResult = result;
        console.log('Quiz submitted, result:', result);
      }
      this.router.navigate(['/summary']);
    } catch (err: any) {
      console.error('Submission failed:', err);
      this.toast.show('Failed to submit quiz results');
      // Still navigate to summary or handle error
      this.router.navigate(['/summary']);
    }
  }

  private tick() {
    this.timeLeft--;
    if (this.timeLeft > 0) { 
      this.timerId = setTimeout(() => this.tick(), 1000); 
    } else { 
      this.finish(); 
    }
  }
}