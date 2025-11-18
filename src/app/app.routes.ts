import { Routes } from '@angular/router';
import { authGuard, guestGuard, onboardingGuard, emailVerificationGuard } from '@app/core';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/landing-screen/landing-screen').then((c) => c.LandingScreen),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing-page/landing-page').then((c) => c.LandingPage),
      },
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
        path: 'forgot-password',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/forgot-password/forgot-password').then((c) => c.ForgotPassword),
      },

      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/reset-password/reset-password').then((c) => c.ResetPassword),
      },
      {
        path: 'email-verification',
        canActivate: [emailVerificationGuard],
        loadComponent: () =>
          import('./features/email-verification/email-verification').then(
            (c) => c.EmailVerification,
          ),
      },
      {
        path: 'onboarding/interest-selection',
        canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./features/interests-selection/interests-selection').then(
            (c) => c.InterestsSelection,
          ),
      },
      {
        path: 'onboarding/level-selection',
        canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./features/level-selection/level-selection').then((c) => c.LevelSelection),
      },
      {
        path: 'plan-confirmation/:id',
        loadComponent: () =>
          import('./features/plan-confirmation/plan-confirmation').then((c) => c.PlanConfirmation),
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
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks-dashboard/tasks-dashboard').then((c) => c.TasksDashboard),
      },
      {
        path: 'tasks/coding-assessment/:taskId',
        loadComponent: () =>
          import('./features/coding-assessment/coding-assessment').then((c) => c.CodingAssessment),
      },
    ],
  },
];
