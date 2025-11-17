import { AppError, DashboardData, RecommendedTaskUI, SkillTrajectoryData } from '@app/core';

export interface DashboardState {
  data: DashboardData | null;
  isDashboardAnalyticsLoading: boolean;
  isDashboardAnalyticsError: AppError | null;

  recommendedTasks: RecommendedTaskUI[];
  isRecommendedTasksLoading: boolean;
  isRecommendedTasksError: AppError | null;

  trajectoryData: SkillTrajectoryData[];
  isTrajectoryLoading: boolean;
  isTrajectoryError: AppError | null;
}

export const initialDashboardState: DashboardState = {
  data: null,
  isDashboardAnalyticsLoading: false,
  isDashboardAnalyticsError: null,

  recommendedTasks: [],
  isRecommendedTasksLoading: false,
  isRecommendedTasksError: null,

  trajectoryData: [],
  isTrajectoryLoading: false,
  isTrajectoryError: null,
};
