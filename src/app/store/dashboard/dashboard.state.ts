export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
}

export interface DashboardState {
  stats: DashboardStats | null;
  recentActivity: Activity[];
}

export const initialDashboardState: DashboardState = {
  stats: null,
  recentActivity: [],
};
