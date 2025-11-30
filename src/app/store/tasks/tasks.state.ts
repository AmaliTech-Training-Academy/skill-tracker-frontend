import { AppError } from '@app/core';
import {
  TaskUI,
  CompletedPeriod,
  Task,
  CodeExecutionResponse,
  SubmissionStatus,
  PagedResponse,
} from '@app/core/models/tasks-model';

export interface TasksState {
  pendingTasks: TaskUI[];
  completedTasks: TaskUI[];
  pendingTasksPagination: PagedResponse<TaskUI> | null;
  completedTasksPagination: PagedResponse<TaskUI> | null;
  currentPendingPage: number;
  currentCompletedPage: number;
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
  submissionResult: {
    success: boolean;
    submissionId?: string;
    xpEarned?: number;
    error?: string;
  } | null;
  submissionState: {
    status: SubmissionStatus;
    submissionId?: string;
    error?: string;
    canRetry: boolean;
    feedback?: Record<string, unknown>;
  };
  error: string | null;
  timer: {
    isRunning: boolean;
    remainingSeconds: number;
    endTime: number | null;
    taskId: string | null;
  };
  totalUserXp: number;
  isLoadingTotalUserXp: boolean;
  totalUserXpError: AppError | null;
}

export const initialTasksState: TasksState = {
  pendingTasks: [],
  completedTasks: [],
  pendingTasksPagination: null,
  completedTasksPagination: null,
  currentPendingPage: 0,
  currentCompletedPage: 0,
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
  submissionResult: null,
  submissionState: {
    status: SubmissionStatus.IDLE,
    canRetry: false,
  },
  error: null,
  timer: {
    isRunning: false,
    remainingSeconds: 0,
    endTime: null,
    taskId: null,
  },
  totalUserXp: 0,
  isLoadingTotalUserXp: false,
  totalUserXpError: null,
};
