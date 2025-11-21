import { createReducer, on } from '@ngrx/store';
import * as TasksActions from './tasks.actions';
import { initialTasksState, TasksState } from './tasks.state';

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

  on(
    TasksActions.clearCurrentTask,
    (state): TasksState => ({
      ...state,
      currentTask: null,
      currentTaskLoading: false,
      error: null,
      timer: {
        isRunning: false,
        remainingSeconds: 0,
        endTime: null,
        taskId: null,
      },
    }),
  ),

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
);
