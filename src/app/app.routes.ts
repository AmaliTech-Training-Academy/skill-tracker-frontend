import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/landing-screen/landing-screen').then((c) => c.LandingScreen),
    children: [
      { path: '', loadComponent: () => import('./features/home/home').then((c) => c.Home) },
      {
        path: 'signup',
        loadComponent: () => import('./features/signup/signup').then((c) => c.Signup),
      },
      { path: 'login', loadComponent: () => import('./features/login/login').then((c) => c.Login) },
      {
        path: 'test',
        loadComponent: () => import('./features/api-test/api-test').then((c) => c.ApiTest),
      },
      {
        path: 'verify-otp',
        loadComponent: () => import('./features/otp-test/otp-test').then((c) => c.OtpTest),
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./features/onboarding-test/onboarding-test').then((c) => c.OnboardingTest),
      },
    ],
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/dashboard/dashboard').then((c) => c.Dashboard),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard').then((c) => c.Dashboard),
      },
      { path: 'tasks', loadComponent: () => import('./features/tasks/tasks').then((c) => c.Tasks) },
    ],
  },
];
