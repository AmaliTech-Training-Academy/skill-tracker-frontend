import { createFeatureSelector, createSelector } from '@ngrx/store';
import { McqGenerationState } from './mcq.state';

export const selectMcqGenerationState =
  createFeatureSelector<McqGenerationState>('mcqGeneration');

export const selectMcqQuestions = createSelector(
  selectMcqGenerationState,
  (state) => (state ? state.questions : null),
);

export const selectMcqLoading = createSelector(
  selectMcqGenerationState,
  (state) => (state ? state.loading : false),
);

export const selectMcqError = createSelector(
  selectMcqGenerationState,
  (state) => (state ? state.error : null),
);

export const selectMcqTotalTime = createSelector(
  selectMcqQuestions,
  (questions) => {
    if (!questions || !Array.isArray(questions) || !questions.length) {
      return 0;
    }
    return questions.reduce((total, question) => total + (question.question_duration || 0), 0);
  },
);