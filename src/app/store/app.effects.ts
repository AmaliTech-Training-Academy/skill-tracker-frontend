import { AuthEffects } from './auth/auth.effects';
import { UIEffects } from './ui/ui.effects';
import { DashboardEffects } from './dashboard/dashboard.effects';

export const appEffects = [AuthEffects, UIEffects, DashboardEffects];
