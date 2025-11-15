import { TaskUI, CompletedPeriod, Task } from '@app/core/models/tasks-model';

export interface TasksState {
  pendingTasks: TaskUI[];
  completedTasks: TaskUI[];
  currentTask: Task | null;
  skills: string[];
  selectedSkill: string;
  timeRanges: string[];
  selectedTimeRange: CompletedPeriod;
  loading: boolean;
  currentTaskLoading: boolean;
  error: string | null;
  timer: {
    isRunning: boolean;
    remainingSeconds: number;
    totalSeconds: number;
  };
}

export const initialTasksState: TasksState = {
  pendingTasks: [],
  completedTasks: [],
  currentTask: null,
  skills: ['All Skills', 'HTML', 'CSS', 'Data Structures', 'Python', 'JavaScript'],
  timeRanges: ['All Periods', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Older'],
  selectedSkill: 'All Skills',
  selectedTimeRange: CompletedPeriod.ALL_PERIODS,
  loading: false,
  currentTaskLoading: false,
  error: null,
  timer: {
    isRunning: false,
    remainingSeconds: 0,
    totalSeconds: 0,
  },
};
