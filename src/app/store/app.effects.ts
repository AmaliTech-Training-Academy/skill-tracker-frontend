import { AuthEffects } from './auth/auth.effects';
import { OnboardingEffects } from './onboarding/onboarding.effects';
import { UIEffects } from './ui/ui.effects';
import { TasksEffects } from './tasks/tasks.effects';
import { DashboardEffects } from './dashboard/dashboard.effects';

export const appEffects = [
  AuthEffects,
  UIEffects,
  OnboardingEffects,
  TasksEffects,
  DashboardEffects,
];
