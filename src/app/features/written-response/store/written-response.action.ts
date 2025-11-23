import { createAction, props } from '@ngrx/store';
import { WrittenResponseTask, WrittenResponseSubmissionResponse } from './written-response.state';
import { SubmissionResponse } from '@app/core/models/tasks-model';

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

export const submitWrittenResponseTask = createAction(
  '[Written Response] Submit Task',
  props<{ taskId: string; answer: string }>(),
);

export const submitWrittenResponseTaskSuccess = createAction(
  '[Written Response] Submit Task Success',
  props<{ response: WrittenResponseSubmissionResponse }>(),
);

export const submitWrittenResponseTaskFailure = createAction(
  '[Written Response] Submit Task Failure',
  props<{ error: string }>(),
);

export const getWrittenResponseSubmissionStatus = createAction(
  '[Written Response] Get Submission Status',
  props<{ submissionId: string }>(),
);

export const getWrittenResponseSubmissionStatusSuccess = createAction(
  '[Written Response] Get Submission Status Success',
  props<{ submission: SubmissionResponse }>(),
);

export const getWrittenResponseSubmissionStatusFailure = createAction(
  '[Written Response] Get Submission Status Failure',
  props<{ error: string }>(),
);

export const completeWrittenResponseQuiz = createAction('[Written Response] Complete Quiz');
export const reviewWrittenResponseTask = createAction('[Written Response] Review Task');
export const clearWrittenResponseState = createAction('[Written Response] Clear State');
