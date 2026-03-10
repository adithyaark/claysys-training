import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { APP_CONFIG } from '../app.constants';

export interface User {
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  
  private userSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  user$: Observable<User | null> = this.userSubject.asObservable();

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(APP_CONFIG.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(APP_CONFIG.tokenKey);
  }

  signUp(username: string, email: string, pass: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${APP_CONFIG.apiBaseUrl}/auth/register`, {
      username,
      email,
      password: pass
    }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  signIn(email: string, pass: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${APP_CONFIG.apiBaseUrl}/auth/login`, {
      email,
      password: pass
    }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout() {
    localStorage.removeItem(APP_CONFIG.tokenKey);
    localStorage.removeItem(APP_CONFIG.userKey);
    this.userSubject.next(null);
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem(APP_CONFIG.tokenKey, res.token);
    const user: User = { 
      username: res.username, 
      email: '', // Backend doesn't return email in AuthResponseDto, could be added if needed
      role: res.role 
    };
    localStorage.setItem(APP_CONFIG.userKey, JSON.stringify(user));
    this.userSubject.next(user);
  }
}
