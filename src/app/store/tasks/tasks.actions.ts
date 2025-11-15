import { createAction, props } from '@ngrx/store';
import { GroupedTasksResponse, CompletedPeriod } from '@app/core/models/tasks-model';

export const loadTasks = createAction('[Tasks Dashboard] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Tasks API] Load Tasks Success',
  props<{ data: GroupedTasksResponse }>(),
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
  '[Tasks List] Change Time Range Period Filter',
  props<{ period: CompletedPeriod }>(),
);

export const startTask = createAction('[Task Card] Start Task', props<{ taskId: string }>());
