import { Routes } from '@angular/router';
import { HomeComponent }    from './pages/home/home'; 
import { QuizComponent }    from './pages/quiz/quiz';
import { SummaryComponent } from './pages/summary/summary';
import { AdminComponent }   from './pages/admin/admin';
import { AuthComponent }    from './pages/auth/auth';
import { authGuard }     from './guards/auth.guard';
import { AdminGuard }    from './guards/admin.guard';

export const routes: Routes = [
  { path: '',        component: AuthComponent },
  { path: 'home',    component: HomeComponent,    canActivate: [authGuard] },
  { path: 'quiz',    component: QuizComponent,    canActivate: [authGuard] },
  { path: 'summary', component: SummaryComponent, canActivate: [authGuard] },
  { path: 'admin',   component: AdminComponent,   canActivate: [AdminGuard] },
  { path: 'register',component: AuthComponent },
  { path: '**',      redirectTo: '' },
];
