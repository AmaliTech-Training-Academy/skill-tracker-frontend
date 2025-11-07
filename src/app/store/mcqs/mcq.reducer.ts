import { createReducer, on } from '@ngrx/store';
import * as McqActions from './mcq.actions';
import { initialMcqGenerationState, McqGenerationState } from './mcq.state';

export const mcqGenerationReducer = createReducer(
  initialMcqGenerationState,

  on(
    McqActions.generateMcqQuiz,
    (state): McqGenerationState => ({
      ...state,
      loading: true,
      error: null,
      questions: null,
    }),
  ),

  on(
    McqActions.generateMcqQuizSuccess,
    (state, { response }): McqGenerationState => ({
      ...state,
      questions: response.data.mcqQuestion,
      loading: false,
    }),
  ),

  on(
    McqActions.generateMcqQuizFailure,
    (state, { error }): McqGenerationState => ({
      ...state,
      error,
      loading: false,
    }),
  ),

  on(
    McqActions.clearMcqQuiz,
    (): McqGenerationState => ({
      ...initialMcqGenerationState,
    }),
  ),
);
