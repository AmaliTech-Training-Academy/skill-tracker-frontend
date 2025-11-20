import {
  TaskUI,
  CompletedPeriod,
  Task,
  CodeExecutionResponse,
  ProgrammingLanguage,
} from '@app/core/models/tasks-model';

export interface TasksState {
  pendingTasks: TaskUI[];
  completedTasks: TaskUI[];
  currentTask: Task | null;
  userCode: string;
  skills: string[];
  selectedSkill: string;
  timeRanges: string[];
  selectedTimeRange: CompletedPeriod;
  loading: boolean;
  currentTaskLoading: boolean;
  codeExecuting: boolean;
  submitting: boolean;
  executionResult: CodeExecutionResponse | null;
  languages: ProgrammingLanguage[];
  languagesLoading: boolean;
  error: string | null;
  timer: {
    isRunning: boolean;
    remainingSeconds: number;
    endTime: number | null;
    taskId: string | null;
  };
}

export const initialTasksState: TasksState = {
  pendingTasks: [],
  completedTasks: [],
  currentTask: null,
  userCode: '',
  skills: ['All Skills'],
  selectedSkill: 'All Skills',
  timeRanges: ['All Periods', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Older'],
  selectedTimeRange: CompletedPeriod.ALL_PERIODS,
  loading: false,
  currentTaskLoading: false,
  codeExecuting: false,
  submitting: false,
  executionResult: null,
  languages: [],
  languagesLoading: false,
  error: null,
  timer: {
    isRunning: false,
    remainingSeconds: 0,
    endTime: null,
    taskId: null,
  },
};
