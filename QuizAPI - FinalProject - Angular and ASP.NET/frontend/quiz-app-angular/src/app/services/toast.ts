import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message$ = new BehaviorSubject<string>('');
  private timer: any;

  show(msg: string): void {
    this.message$.next(msg);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.message$.next(''), 2800);
  }
}