import { Injectable } from '@angular/core';
import { Course, Question } from './data.service';

@Injectable({ providedIn: 'root' })
export class QuizStateService {
  course:    Course | null   = null;
  quizId:    number | null   = null;
  userName:  string          = '';
  questions: Question[]      = [];
  currentQ:  number          = 0;
  answers:   (string|null)[] = []; // C# backend expects strings "A", "B", "C", "D"
  lastResult: any            = null;

  get isReady(): boolean {
    return this.course !== null && this.questions.length > 0;
  }

  shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  reset(): void {
    this.course = null;  this.quizId = null;  this.userName = '';
    this.questions = [];  this.currentQ = 0;  this.answers = [];
  }
}