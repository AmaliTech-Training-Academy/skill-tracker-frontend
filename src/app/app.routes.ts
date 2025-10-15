import { Routes } from '@angular/router';

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
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/forgot-password/forgot-password').then((c) => c.ForgotPassword),
      },
    ],
  },

  {
    path: 'dashboard',
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
