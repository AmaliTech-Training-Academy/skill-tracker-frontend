import { AuthState } from './auth/auth.state';
import { UIState } from './ui/ui.state';
import { UserState } from './user/user.state';
import { TasksState } from './tasks/tasks.state';
import { DashboardState } from './dashboard/dashboard.state';
import { tasksReducer } from './tasks/tasks.reducer';
import { uiReducer } from './ui';
import { authReducer } from './auth/auth.reducer';

export interface AppState {
  auth: AuthState;
  ui: UIState;
  user: UserState;
  tasks: TasksState;
  dashboard: DashboardState;
}

export const appState = {
  ui: uiReducer,
  auth: authReducer,
  tasks: tasksReducer,
};
