import { createReducer, on } from '@ngrx/store';
import { initialDashboardState } from './dashboard.state';
import { loadDashboard } from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialDashboardState,
  on(loadDashboard, (state) => ({
    ...state,
    isLoading: true,
  })),
);
