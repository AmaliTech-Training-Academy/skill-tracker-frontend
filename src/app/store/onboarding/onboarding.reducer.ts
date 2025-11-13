import { createReducer, on } from '@ngrx/store';
import { initialOnboardingState } from './onboarding.state';
import { getSkills, getSkillsFailure, getSkillsSuccess } from './onboarding.actions';

export const onboardingReducer = createReducer(
  initialOnboardingState,
  on(getSkills, (state) => ({
    ...state,
    isGettingSkills: true,
    skillsError: null,
    skillsSuccess: false,
  })),
  on(getSkillsSuccess, (state, { skills }) => ({
    ...state,
    isGettingSkills: false,
    skillsSuccess: true,
    skillsError: null,
    skills,
  })),
  on(getSkillsFailure, (state, { error }) => ({
    ...state,
    isGettingSkills: false,
    skillsSuccess: false,
    skillsError: error,
  })),
);
