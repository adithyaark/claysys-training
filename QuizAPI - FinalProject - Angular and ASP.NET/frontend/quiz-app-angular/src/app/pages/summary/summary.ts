import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../../services/quiz-state';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class SummaryComponent implements OnInit {
  private state = inject(QuizStateService);
  private router = inject(Router);

  correct = 0; 
  wrong = 0; 
  total = 0; 
  pct = 0; 
  grade = '';

  get userName() { return this.state.userName; }
  get courseTitle() { return this.state.course?.title; }

  ngOnInit() {
    if (!this.state.isReady || !this.state.lastResult) {
      this.router.navigate(['/']); 
      return; 
    }

    const res = this.state.lastResult;
    this.total   = res.totalQuestions;
    this.correct = res.correctAnswers;
    this.wrong   = this.total - this.correct;
    this.pct     = Math.round((this.correct / this.total) * 100);
    
    this.grade   =
      this.pct >= 80 ? 'Excellent! 🎉' :
      this.pct >= 60 ? 'Good job! 👍'  :
      this.pct >= 40 ? 'Keep going 💪'  : 'Try again 📖';
  }
}