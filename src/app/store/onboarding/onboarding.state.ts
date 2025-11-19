import { AppError } from '@app/core';
import { Skill } from '@app/features/interests-selection/models/skill.model';

export interface OnboardingState {
  isGettingSkills: boolean;
  skillsSuccess: boolean;
  skillsError: AppError | null;
  skills: Skill[];
}

export const initialOnboardingState: OnboardingState = {
  isGettingSkills: false,
  skillsSuccess: false,
  skillsError: null,
  skills: [],
};
