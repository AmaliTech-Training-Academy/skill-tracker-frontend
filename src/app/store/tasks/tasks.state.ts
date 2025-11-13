import { TaskUI } from '@app/core/models/tasks-model';

export interface TasksState {
  todayTasks: TaskUI[];
  previousTasks: TaskUI[];
  skills: string[];
  selectedSkill: string;
  timeRanges: string[];
  selectedTimeRange: string;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  todayTasks: [],
  previousTasks: [],
  skills: ['All Skills', 'HTML', 'CSS', 'DATA_STRUCTURES', 'PYTHON', 'JAVASCRIPT'],
  timeRanges: ['All Periods', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Older'],
  selectedSkill: 'All Skills',
  selectedTimeRange: 'All Periods',
  loading: false,
  error: null,
};
