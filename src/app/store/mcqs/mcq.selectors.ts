import { createFeatureSelector, createSelector } from '@ngrx/store';
import { McqGenerationState } from './mcq.state';

export const selectMcqGenerationState = createFeatureSelector<McqGenerationState>('mcqGeneration');

export const selectMcqQuestions = createSelector(
  selectMcqGenerationState,
  (state) => state.questions,
);

export const selectMcqLoading = createSelector(selectMcqGenerationState, (state) => state.loading);

export const selectMcqError = createSelector(selectMcqGenerationState, (state) => state.error);

export const selectMcqTotalTime = createSelector(selectMcqQuestions, (questions) => {
  if (!questions || questions.length === 0) {
    return 0;
  }
  return questions.reduce((total, q) => total + q.question_duration, 0);
});
