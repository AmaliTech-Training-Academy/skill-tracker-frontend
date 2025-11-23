import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectIsDashboardAnalyticsLoading = createSelector(
  selectDashboardState,
  ({ isDashboardAnalyticsLoading }) => isDashboardAnalyticsLoading,
);

export const selectDashboardAnalyticsError = createSelector(
  selectDashboardState,
  ({ isDashboardAnalyticsError }) => isDashboardAnalyticsError,
);

export const selectDashboardData = createSelector(selectDashboardState, ({ data }) => data);

export const selectUserStats = createSelector(
  selectDashboardData,
  (data) => data?.userStats ?? null,
);

export const selectSkillsInProgressCount = createSelector(
  selectDashboardData,
  (data) => data?.skillProgress?.length ?? 0,
);

export const selectPrimarySkillProgress = createSelector(
  selectDashboardData,
  (data) => data?.skillProgress?.[0] ?? null,
);

export const selectGoalStatus = createSelector(
  selectDashboardData,
  (data) => data?.goalStatus ?? [],
);

export const selectGlobalRank = createSelector(
  selectDashboardData,
  (data) => data?.globalRank ?? 0,
);

export const selectRecommendedTasks = createSelector(
  selectDashboardState,
  ({ recommendedTasks }) => recommendedTasks,
);

export const selectIsRecommendedTasksLoading = createSelector(
  selectDashboardState,
  ({ isRecommendedTasksLoading }) => isRecommendedTasksLoading,
);

export const selectRecommendedTasksError = createSelector(
  selectDashboardState,
  ({ isRecommendedTasksError }) => isRecommendedTasksError,
);

export const selectTrajectoryData = createSelector(
  selectDashboardState,
  ({ trajectoryData }) => trajectoryData,
);

export const selectIsTrajectoryLoading = createSelector(
  selectDashboardState,
  ({ isTrajectoryLoading }) => isTrajectoryLoading,
);

export const selectTrajectoryError = createSelector(
  selectDashboardState,
  ({ isTrajectoryError }) => isTrajectoryError,
);

export const selectUserSkills = createSelector(
  selectDashboardState,
  ({ userSkills }: DashboardState) => userSkills,
);

export const selectIsUserSkillsLoading = createSelector(
  selectDashboardState,
  ({ isUserSkillsLoading }: DashboardState) => isUserSkillsLoading,
);

export const selectSelectedSkillId = createSelector(
  selectDashboardState,
  ({ selectedSkillId }: DashboardState) => selectedSkillId,
);
