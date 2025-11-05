import { createAction, props } from '@ngrx/store';
import { Task } from '@app/core/models/tasks-model';

export const loadTasks = createAction('[Tasks Dashboard] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Tasks API] Load Tasks Success',
  props<{ todayTasks: Task[]; previousTasks: Task[] }>(),
);

export const loadTasksFailure = createAction(
  '[Tasks API] Load Tasks Failure',
  props<{ error: string }>(),
);

export const changeSkillFilter = createAction(
  '[Tasks Header] Change Skill Filter',
  props<{ skill: string }>(),
);

export const changeTimeRangeFilter = createAction(
  '[Tasks List] Change Time Range Filter',
  props<{ timeRange: string }>(),
);

export const startTask = createAction('[Task Card] Start Task', props<{ taskId: string }>());
