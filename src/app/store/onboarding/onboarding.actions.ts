import { createAction, props } from '@ngrx/store';
import { AppError } from '@app/core';
import { Skill } from '@app/features/interests-selection/models/skill.model';

export const getSkills = createAction('[Onboarding/Skills] Get Skills');
export const getSkillsSuccess = createAction(
  '[Onboarding/Skills] Get Skills Success',
  props<{ skills: Skill[] }>(),
);
export const getSkillsFailure = createAction(
  '[Onboarding/Skills] Get Skills Failure',
  props<{ error: AppError }>(),
);
