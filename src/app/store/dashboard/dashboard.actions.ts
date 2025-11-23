import { createAction, props } from '@ngrx/store';
import { AppError, UserSelectedSkill } from '@app/core';
import { DashboardData, TaskUI, SkillTrajectoryData, TrajectoryGranularity } from '@app/core';

export const loadDashboardAnalytics = createAction('[Dashboard Page] Load Dashboard Analytics');

export const loadDashboardAnalyticsSuccess = createAction(
  '[Dashboard API] Load Dashboard Analytics Success',
  props<{ data: DashboardData }>(),
);

export const loadDashboardAnalyticsFailure = createAction(
  '[Dashboard API] Load Dashboard Analytics Failure',
  props<{ error: AppError }>(),
);

export const loadRecommendedTasks = createAction(
  '[Dashboard Page] Load Recommended Tasks',
  props<{ skillName?: string }>(),
);

export const loadRecommendedTasksSuccess = createAction(
  '[Dashboard API] Load Recommended Tasks Success',
  props<{ tasks: TaskUI[] }>(),
);

export const loadRecommendedTasksFailure = createAction(
  '[Dashboard API] Load Recommended Tasks Failure',
  props<{ error: AppError }>(),
);

export const loadDashboardTrajectory = createAction(
  '[Dashboard Page] Load Dashboard Trajectory',
  props<{ skillId: string; granularity: TrajectoryGranularity }>(),
);

export const loadDashboardTrajectorySuccess = createAction(
  '[Dashboard API] Load Dashboard Trajectory Success',
  props<{ trajectoryData: SkillTrajectoryData[] }>(),
);

export const loadDashboardTrajectoryFailure = createAction(
  '[Dashboard API] Load Dashboard Trajectory Failure',
  props<{ error: AppError }>(),
);

export const loadUserSkills = createAction('[Dashboard Page] Load User Skills');

export const loadUserSkillsSuccess = createAction(
  '[Dashboard API] Load User Skills Success',
  props<{ skills: UserSelectedSkill[] }>(),
);

export const loadUserSkillsFailure = createAction(
  '[Dashboard API] Load User Skills Failure',
  props<{ error: AppError }>(),
);

export const setSelectedSkill = createAction(
  '[Dashboard Page] Set Selected Skill',
  props<{ skillId: string }>(),
);
