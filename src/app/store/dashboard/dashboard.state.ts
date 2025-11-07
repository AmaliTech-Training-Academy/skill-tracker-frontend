import { DashboardData } from '@app/core';
import { EMPTY_STATE_DATA } from '@app/core';

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

export const initialDashboardState: DashboardState = {
  data: EMPTY_STATE_DATA,
  isLoading: false,
  error: null,
};
