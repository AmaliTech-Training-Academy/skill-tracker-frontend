import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OnboardingState } from './onboarding.state';

export const selectOnboardingState = createFeatureSelector<OnboardingState>('onboarding');

export const selectSkills = createSelector(
  selectOnboardingState,
  (state: OnboardingState) => state.skills ?? null,
);

export const selectIsGettingSkills = createSelector(
  selectOnboardingState,
  (state: OnboardingState) => state.isGettingSkills,
);

export const selectSkillsError = createSelector(
  selectOnboardingState,
  (state: OnboardingState) => state.skillsError,
);
