import { createAction, props } from '@ngrx/store';
import { WrittenResponseTask } from './written-response.state';

export const loadWrittenResponseTask = createAction(
  '[Written Response] Load Task Details',
  props<{ taskId: string }>(),
);

export const loadWrittenResponseTaskSuccess = createAction(
  '[Written Response API] Load Task Details Success',
  props<{ task: WrittenResponseTask }>(),
);

export const loadWrittenResponseTaskFailure = createAction(
  '[Written Response API] Load Task Details Failure',
  props<{ error: string }>(),
);

export const updateWrittenResponseUserAnswer = createAction(
  '[Written Response] Update User Answer',
  props<{ answer: string }>(),
);

export const clearWrittenResponseState = createAction('[Written Response] Clear State');