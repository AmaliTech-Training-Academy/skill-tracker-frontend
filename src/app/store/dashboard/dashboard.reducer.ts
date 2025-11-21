import { createReducer, on } from '@ngrx/store';
import { initialDashboardState } from './dashboard.state';
import {
  loadDashboardAnalytics,
  loadDashboardAnalyticsSuccess,
  loadDashboardAnalyticsFailure,
  loadRecommendedTasks,
  loadRecommendedTasksSuccess,
  loadRecommendedTasksFailure,
  loadDashboardTrajectory,
  loadDashboardTrajectorySuccess,
  loadDashboardTrajectoryFailure,
} from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialDashboardState,
  on(loadDashboardAnalytics, (state) => ({
    ...state,
    isDashboardAnalyticsLoading: true,
    isDashboardAnalyticsError: null,
  })),
  on(loadDashboardAnalyticsSuccess, (state, { data }) => ({
    ...state,
    data,
    isDashboardAnalyticsLoading: false,
    isDashboardAnalyticsError: null,
  })),
  on(loadDashboardAnalyticsFailure, (state, { error }) => ({
    ...state,
    isDashboardAnalyticsLoading: false,
    isDashboardAnalyticsError: error,
  })),
  on(loadRecommendedTasks, (state) => ({
    ...state,
    isRecommendedTasksLoading: true,
    isRecommendedTasksError: null,
  })),
  on(loadRecommendedTasksSuccess, (state, { tasks }) => ({
    ...state,
    recommendedTasks: tasks,
    isRecommendedTasksLoading: false,
    isRecommendedTasksError: null,
  })),
  on(loadRecommendedTasksFailure, (state, { error }) => ({
    ...state,
    isRecommendedTasksLoading: false,
    isRecommendedTasksError: error,
  })),
  on(loadDashboardTrajectory, (state) => ({
    ...state,
    isTrajectoryLoading: true,
    isTrajectoryError: null,
  })),
  on(loadDashboardTrajectorySuccess, (state, { trajectoryData }) => ({
    ...state,
    trajectoryData,
    isTrajectoryLoading: false,
    isTrajectoryError: null,
  })),
  on(loadDashboardTrajectoryFailure, (state, { error }) => ({
    ...state,
    isTrajectoryLoading: false,
    isTrajectoryError: error,
  })),
);
