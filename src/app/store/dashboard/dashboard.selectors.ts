import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectIsDashboardAnalyticsLoading = createSelector(
  selectDashboardState,
  (state) => state.isDashboardAnalyticsLoading,
);

export const selectDashboardAnalyticsError = createSelector(
  selectDashboardState,
  (state) => state.isDashboardAnalyticsError,
);

export const selectDashboardData = createSelector(selectDashboardState, (state) => state.data);

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

export const selectRecommendedTasks = createSelector(
  selectDashboardState,
  (state) => state.recommendedTasks,
);

export const selectIsRecommendedTasksLoading = createSelector(
  selectDashboardState,
  (state) => state.isRecommendedTasksLoading,
);

export const selectRecommendedTasksError = createSelector(
  selectDashboardState,
  (state) => state.isRecommendedTasksError,
);

export const selectTrajectoryData = createSelector(
  selectDashboardState,
  (state) => state.trajectoryData,
);

export const selectIsTrajectoryLoading = createSelector(
  selectDashboardState,
  (state) => state.isTrajectoryLoading,
);

export const selectTrajectoryError = createSelector(
  selectDashboardState,
  (state) => state.isTrajectoryError,
);
