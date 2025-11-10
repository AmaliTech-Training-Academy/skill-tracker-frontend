import { AuthEffects } from './auth/auth.effects';
import { UIEffects } from './ui/ui.effects';
import { McqGenerationEffects } from './mcqs/mcq.effects';

export const appEffects = [AuthEffects, UIEffects, McqGenerationEffects];
