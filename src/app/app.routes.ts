import { Routes } from '@angular/router';
import { authGuard, guestGuard, onboardingGuard } from '@app/core';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/landing-screen/landing-screen').then((c) => c.LandingScreen),
    children: [
      { path: '', loadComponent: () => import('./features/home/home').then((c) => c.Home) },
      {
        path: 'signup',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/signup/signup').then((c) => c.Signup),
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/login/login').then((c) => c.Login),
      },
      {
        path: 'email-verification',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/email-verification/email-verification').then(
            (c) => c.EmailVerification,
          ),
      },
      {
        path: 'onboarding/level-selection',
        canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./features/level-selection/level-selection').then((c) => c.LevelSelection),
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
