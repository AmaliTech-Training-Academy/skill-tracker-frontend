import { TaskUI, CompletedPeriod } from '@app/core/models/tasks-model';

export interface TasksState {
  pendingTasks: TaskUI[];
  completedTasks: TaskUI[];
  skills: string[];
  selectedSkill: string;
  timeRanges: string[];
  selectedTimeRange: CompletedPeriod;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  pendingTasks: [],
  completedTasks: [],
  skills: ['All Skills', 'HTML', 'CSS', 'Data Structures', 'Python', 'JavaScript'],
  timeRanges: ['All Periods', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Older'],
  selectedSkill: 'All Skills',
  selectedTimeRange: CompletedPeriod.ALL_PERIODS,
  loading: false,
  error: null,
};
