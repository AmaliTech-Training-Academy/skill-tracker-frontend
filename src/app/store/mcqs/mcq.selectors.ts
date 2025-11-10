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
    // CRITICAL FIX: Ensure questions is an array before calling reduce.
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return 0;
    }
    // FIX: Add a null/undefined check for question_duration to ensure it is always treated as a number.
    return questions.reduce((total, q) => total + (q.question_duration || 0), 0);
  },
);