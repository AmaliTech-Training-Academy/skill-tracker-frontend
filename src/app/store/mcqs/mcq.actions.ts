import { createAction, props } from '@ngrx/store';
import { McqRetrieveRequest, McqResponse } from '@app/core/models/mcq-model';

export const generateMcqQuiz = createAction(
  '[MCQ] Generate MCQ Quiz',
  props<{ request: McqRetrieveRequest }>(),
);

export const generateMcqQuizSuccess = createAction(
  '[MCQ API] Generate MCQ Quiz Success',
  props<{ response: McqResponse }>(),
);

export const generateMcqQuizFailure = createAction(
  '[MCQ API] Generate MCQ Quiz Failure',
  props<{ error: string }>(),
);

export const clearMcqQuiz = createAction('[MCQ] Clear MCQ Quiz State');
