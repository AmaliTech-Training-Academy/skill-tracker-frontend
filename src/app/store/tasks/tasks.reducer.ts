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
    (state, { data }): TasksState => ({
      ...state,
      pendingTasks: data.pending.content,
      completedTasks: data.completed.content,
      loading: false,
      error: null,
    }),
  ),

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
);
