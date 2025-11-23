import { createReducer, on } from '@ngrx/store';
import * as TasksActions from './tasks.actions';
import { initialTasksState, TasksState } from './tasks.state';
import { SubmissionStatus } from '@app/core/models/tasks-model';

export const tasksReducer = createReducer(
  initialTasksState,

  on(
    TasksActions.loadTasks,
    (state): TasksState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(TasksActions.loadTasksSuccess, (state, { data }): TasksState => {
    const {
      pending: { content: pendingContent },
      completed: { content: completedContent },
    } = data;
    return {
      ...state,
      pendingTasks: pendingContent,
      completedTasks: completedContent,
      loading: false,
      error: null,
    };
  }),

  on(
    TasksActions.loadTasksFailure,
    (state, { error }): TasksState => ({
      ...state,
      pendingTasks: [],
      completedTasks: [],
      loading: false,
      error,
    }),
  ),

  on(
    TasksActions.changeSkillFilter,
    (state, { skill }): TasksState => ({
      ...state,
      selectedSkill: skill,
    }),
  ),

  on(
    TasksActions.changeSkillFilter,
    (state, { skill }): TasksState => ({
      ...state,
      selectedSkill: skill,
    }),
  ),

  on(
    TasksActions.changeTimeRangeFilter,
    (state, { period }): TasksState => ({
      ...state,
      selectedTimeRange: period,
    }),
  ),

  on(
    TasksActions.startTask,
    (state): TasksState => ({
      ...state,
    }),
  ),

  on(
    TasksActions.loadCurrentTask,
    (state): TasksState => ({
      ...state,
      currentTaskLoading: true,
      error: null,
    }),
  ),

  on(
    TasksActions.loadCurrentTaskSuccess,
    (state, { task }): TasksState => ({
      ...state,
      currentTask: task,
      currentTaskLoading: false,
      error: null,
    }),
  ),

  on(
    TasksActions.loadCurrentTaskFailure,
    (state, { error }): TasksState => ({
      ...state,
      currentTask: null,
      currentTaskLoading: false,
      error,
    }),
  ),

  on(TasksActions.clearCurrentTask, (state): TasksState => {
    if (state.timer.taskId) {
      localStorage.removeItem(`userCode_${state.timer.taskId}`);
    }
    return {
      ...state,
      currentTask: null,
      currentTaskLoading: false,
      error: null,
      executionResult: null,
      submissionResult: null,
      submissionState: {
        status: SubmissionStatus.IDLE,
        canRetry: false,
      },
      userCode: '',
      timer: {
        isRunning: false,
        remainingSeconds: 0,
        endTime: null,
        taskId: null,
      },
    };
  }),

  on(TasksActions.startTimer, (state, { durationMinutes, taskId }): TasksState => {
    if (state.timer.isRunning && state.timer.taskId === taskId) {
      return state;
    }

    const totalSeconds = durationMinutes * 60;
    const endTime = Date.now() + totalSeconds * 1000;
    const timerState = {
      isRunning: true,
      remainingSeconds: totalSeconds,
      endTime,
      taskId,
    };

    return { ...state, timer: timerState };
  }),

  on(
    TasksActions.updateTimer,
    (state, { remainingSeconds }): TasksState => ({
      ...state,
      timer: {
        ...state.timer,
        remainingSeconds,
      },
    }),
  ),

  on(
    TasksActions.stopTimer,
    (state): TasksState => ({
      ...state,
      timer: { ...state.timer, isRunning: false },
    }),
  ),

  on(
    TasksActions.timerExpired,
    (state): TasksState => ({
      ...state,
      timer: { ...state.timer, isRunning: false, remainingSeconds: 0 },
    }),
  ),

  on(
    TasksActions.restoreTimerSuccess,
    (state, { timer }): TasksState => ({
      ...state,
      timer,
    }),
  ),

  on(
    TasksActions.loadUserSkillsSuccess,
    (state, { skills }): TasksState => ({
      ...state,
      skills,
    }),
  ),

  on(
    TasksActions.loadUserSkillsFailure,
    (state, { error }): TasksState => ({
      ...state,
      error,
    }),
  ),

  on(
    TasksActions.executeCode,
    (state): TasksState => ({
      ...state,
      codeExecuting: true,
      error: null,
    }),
  ),

  on(
    TasksActions.executeCodeSuccess,
    (state, { result }): TasksState => ({
      ...state,
      codeExecuting: false,
      executionResult: result,
      error: null,
    }),
  ),

  on(
    TasksActions.executeCodeFailure,
    (state, { error }): TasksState => ({
      ...state,
      codeExecuting: false,
      error,
    }),
  ),

  on(
    TasksActions.submitTaskSolution,
    (state): TasksState => ({
      ...state,
      submitting: true,
      submissionState: {
        ...state.submissionState,
        status: SubmissionStatus.SUBMITTING,
        error: undefined,
        canRetry: false,
      },
      error: null,
    }),
  ),

  on(
    TasksActions.submitTaskSolutionSuccess,
    (state, { submissionId, xpEarned }): TasksState => ({
      ...state,
      submitting: false,
      submissionResult: { success: true, submissionId, xpEarned },
      submissionState: {
        ...state.submissionState,
        status: SubmissionStatus.PROCESSING,
        submissionId,
        canRetry: false,
      },
      error: null,
    }),
  ),

  on(
    TasksActions.submitTaskSolutionFailure,
    (state, { error }): TasksState => ({
      ...state,
      submitting: false,
      submissionResult: { success: false, error },
      submissionState: {
        ...state.submissionState,
        status: SubmissionStatus.ERROR,
        error,
        canRetry: true,
      },
      error,
    }),
  ),

  on(
    TasksActions.clearSubmissionResult,
    (state): TasksState => ({
      ...state,
      submissionResult: null,
    }),
  ),

  on(TasksActions.updateUserCode, (state, { code, taskId }): TasksState => {
    localStorage.setItem(`userCode_${taskId}`, code);
    return {
      ...state,
      userCode: code,
    };
  }),

  on(TasksActions.restoreUserCode, (state, { taskId }): TasksState => {
    const savedCode = localStorage.getItem(`userCode_${taskId}`) || '';
    return {
      ...state,
      userCode: savedCode,
    };
  }),

  on(TasksActions.getSubmissionStatusSuccess, (state, { submission }): TasksState => {
    const isCompleted = submission.status === 'COMPLETED' || submission.status === 'ERROR';
    const isCorrect = submission.isCorrect === true;

    return {
      ...state,
      submissionState: {
        ...state.submissionState,
        status: isCompleted
          ? isCorrect
            ? SubmissionStatus.COMPLETED
            : SubmissionStatus.FAILED
          : SubmissionStatus.PROCESSING,
        feedback: submission.feedback,
        canRetry: isCompleted && !isCorrect,
      },
    };
  }),

  on(
    TasksActions.getSubmissionStatusFailure,
    (state, { error }): TasksState => ({
      ...state,
      submissionState: {
        ...state.submissionState,
        status: SubmissionStatus.PROCESSING,
        error,
        canRetry: true,
      },
    }),
  ),

  on(
    TasksActions.retryFeedback,
    (state): TasksState => ({
      ...state,
      submissionState: {
        ...state.submissionState,
        status: SubmissionStatus.PROCESSING,
        error: undefined,
        canRetry: false,
      },
    }),
  ),

  on(
    TasksActions.retrySubmission,
    (state): TasksState => ({
      ...state,
      submissionState: {
        status: SubmissionStatus.IDLE,
        canRetry: false,
      },
      submissionResult: null,
    }),
  ),

  on(
    TasksActions.loadTotalUserXp,
    (state): TasksState => ({
      ...state,
      isLoadingTotalUserXp: true,
      error: null,
    }),
  ),

  on(TasksActions.loadTotalUserXpSuccess, (state, { totalUserXp }) => ({
    ...state,
    totalUserXp,
    isLoadingTotalUserXp: false,
    error: null,
  })),
);
