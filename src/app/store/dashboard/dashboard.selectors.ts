import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';
import { SkillProgress } from '@app/core/models/dashboard.model';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardData = createSelector(selectDashboardState, (state) => state.data);

export const selectDashboardIsLoading = createSelector(
  selectDashboardState,
  (state) => state.isLoading,
);

export const selectDashboardError = createSelector(selectDashboardState, (state) => state.error);

export const selectUserStats = createSelector(selectDashboardData, (data) => data?.userStats);

export const selectRecommendedTasks = createSelector(
  selectDashboardData,
  (data) => data?.recommendedTasks ?? [],
);

export const selectProgressChartData = createSelector(
  selectDashboardData,
  (data) => data?.progressChartData,
);

export const selectPrimarySkillProgress = createSelector(selectDashboardData, (data) =>
  data?.skillProgress ? data.skillProgress[0] : null,
);

export const selectSkillsInProgressCount = createSelector(selectDashboardData, (data) => {
  if (!data?.skillProgress) {
    return 0;
  }

  return data.skillProgress.filter((skill: SkillProgress) => skill.currentXp).length;
});
