import { AuthEffects } from './auth/auth.effects';
import { OnboardingEffects } from './onboarding/onboarding.effects';
import { UIEffects } from './ui/ui.effects';

export const appEffects = [AuthEffects, UIEffects, OnboardingEffects];
