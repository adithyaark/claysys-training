import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../app.constants';
import { AuthService } from './auth';

export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  timeLimitMinutes: number;
  questionCount: number;
}

export interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  points: number;
  quizId: number;
  correctAnswer?: string;
  isCustom: boolean;
}

export interface QuizResult {
  id: number;
  username: string;
  quizId: number;
  quizTitle: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  takenAt: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.token}`
    });
  }

  // Courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${APP_CONFIG.apiBaseUrl}/Course`);
  }

  // Quizzes
  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${APP_CONFIG.apiBaseUrl}/Quiz`);
  }

  getQuizzesByCourse(courseId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${APP_CONFIG.apiBaseUrl}/Quiz/by-course/${courseId}`);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${APP_CONFIG.apiBaseUrl}/Quiz/${id}`);
  }

  // Questions
  getQuestionsByQuiz(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${APP_CONFIG.apiBaseUrl}/Question/by-quiz/${quizId}`);
  }

  // Admin: Questions with answers
  getQuestionsByQuizWithAnswers(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${APP_CONFIG.apiBaseUrl}/Question/by-quiz/${quizId}/with-answers`, { headers: this.headers });
  }

  getAllQuestionsWithAnswers(): Observable<Question[]> {
    return this.http.get<Question[]>(`${APP_CONFIG.apiBaseUrl}/Question/all-with-answers`, { headers: this.headers });
  }

  addQuestion(question: any): Observable<Question> {
    return this.http.post<Question>(`${APP_CONFIG.apiBaseUrl}/Question`, question, { headers: this.headers });
  }

  updateQuestion(id: number, question: any): Observable<Question> {
    return this.http.put<Question>(`${APP_CONFIG.apiBaseUrl}/Question/${id}`, question, { headers: this.headers });
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${APP_CONFIG.apiBaseUrl}/Question/${id}`, { headers: this.headers });
  }

  // Submission
  submitQuiz(quizId: number, answers: { questionId: number, selectedAnswer: string }[]): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${APP_CONFIG.apiBaseUrl}/Question/submit`, {
      quizId,
      answers
    }, { headers: this.headers });
  }

  // Results
  getAllResults(): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${APP_CONFIG.apiBaseUrl}/Quiz/results`, { headers: this.headers });
  }
}
