import { AuthEffects } from './auth/auth.effects';
import { UIEffects } from './ui/ui.effects';
import { TasksEffects } from './tasks/tasks.effects';

export const appEffects = [AuthEffects, UIEffects, TasksEffects];
