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

  on(
    TasksActions.loadTasksSuccess,
    (state, { todayTasks, previousTasks }): TasksState => ({
      ...state,
      todayTasks,
      previousTasks,
      loading: false,
    }),
  ),

  on(
    TasksActions.loadTasksFailure,
    (state, { error }): TasksState => ({
      ...state,
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
    (state, { timeRange }): TasksState => ({
      ...state,
      selectedTimeRange: timeRange,
    }),
  ),
);
