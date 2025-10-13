import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Badges } from './pages/badges/badges';
import { Community } from './pages/community/community';
import { Goals } from './pages/goals/goals';
import { Leaderboard } from './pages/leaderboard/leaderboard';
import { Mainpage } from './pages/mainpage/mainpage';
import { Skillarena } from './pages/skillarena/skillarena';
import { Tasks } from './pages/tasks/tasks';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Mainpage },
      { path: 'badges', component: Badges },
      { path: 'community', component: Community },
      { path: 'goals', component: Goals },
      { path: 'leaderboards', component: Leaderboard },
      { path: 'skillarena', component: Skillarena },
      { path: 'tasks', component: Tasks },
    ],
  },
];
