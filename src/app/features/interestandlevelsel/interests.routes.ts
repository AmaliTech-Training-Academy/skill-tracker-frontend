import { Routes } from '@angular/router';
import { Interests } from './interests/interests';
import { Levels } from './levels/levels';
import { Complete } from './complete/complete';

export const interestsRoutes: Routes = [
  { path: '', redirectTo: 'interests', pathMatch: 'full' },
  { path: 'interests', component: Interests, title: 'Interests' },
  { path: 'levels', component: Levels, title: 'Levels' },
  { path: 'complete', component: Complete, title: 'All set up' },
];
