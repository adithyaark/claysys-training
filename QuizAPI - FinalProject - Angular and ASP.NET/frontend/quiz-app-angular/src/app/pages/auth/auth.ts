import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  isLogin = false;
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  async onSubmit() {
    if (!this.email || !this.password || (!this.isLogin && !this.username)) {
      this.toast.show('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.toast.show('Please enter a valid email address');
      return;
    }

    if (!this.isLogin && this.password !== this.confirmPassword) {
      this.toast.show('Passwords do not match');
      return;
    }

    this.loading = true;
    try {
      if (this.isLogin) {
        await firstValueFrom(this.auth.signIn(this.email, this.password));
        this.toast.show('Login successful!');
      } else {
        await firstValueFrom(this.auth.signUp(this.username, this.email, this.password));
        this.toast.show('Account created successfully!');
      }
      this.router.navigate(['/home']);
    } catch (err: any) {
      console.error(err);
      const msg = err.error?.message || err.message || 'Authentication failed';
      this.toast.show(msg);
    } finally {
      this.loading = false;
    }
  }
}
