import { Routes } from '@angular/router';
import { Mainpage } from './features/home/mainpage/mainpage';
import { planRoutes } from './features/home/planAndPayment/plan.routes';
import { authRoutes } from './features/auth/auth.routes';
import { interestsRoutes } from './features/interestandlevelsel/interests.routes';
import { DashboardRoutes } from './features/dashboard/dashboard.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Mainpage },

  {
    path: 'plan',
    children: planRoutes,
  },

  {
    path: 'auth',
    children: authRoutes,
  },

  {
    path: 'personalize',
    children: interestsRoutes,
  },

  {
    path: 'dashboard',
    children: DashboardRoutes,
  },
];
