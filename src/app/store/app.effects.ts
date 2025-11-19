import { AuthEffects } from './auth/auth.effects';
import { OnboardingEffects } from './onboarding/onboarding.effects';
import { UIEffects } from './ui/ui.effects';
<<<<<<< HEAD
import { McqGenerationEffects } from './mcqs/mcq.effects';

export const appEffects = [AuthEffects, UIEffects, McqGenerationEffects];
=======
import { DashboardEffects } from './dashboard/dashboard.effects';
import { TasksEffects } from './tasks/tasks.effects';

export const appEffects = [
  AuthEffects,
  UIEffects,
  DashboardEffects,
  OnboardingEffects,
  TasksEffects,
];
>>>>>>> b19943e24d5d118fdf7f76bed09c79d7db4b67b4
