import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WrittenResponseState } from './written-response.state';

export const selectWrittenResponseState =
  createFeatureSelector<WrittenResponseState>('writtenResponse');

export const selectWrittenResponseTask = createSelector(
  selectWrittenResponseState,
  (state) => state.task,
);

export const selectWrittenResponseLoading = createSelector(
  selectWrittenResponseState,
  (state) => state.loading,
);

export const selectWrittenResponseError = createSelector(
  selectWrittenResponseState,
  (state) => state.error,
);

export const selectWrittenResponseUserAnswer = createSelector(
  selectWrittenResponseState,
  (state) => state.userAnswer,
);

export const selectWrittenResponsePrompt = createSelector(
  selectWrittenResponseTask,
  (task) => task?.content?.prompt,
);

export const selectWrittenResponseTitle = createSelector(
  selectWrittenResponseTask,
  (task) => task?.title || 'Loading Task...',
);

export const selectWrittenResponseDifficulty = createSelector(
  selectWrittenResponseTask,
  (task) => task?.difficulty || 'N/A',
);

export const selectWrittenResponseXpReward = createSelector(
  selectWrittenResponseTask,
  (task) => task?.xpReward || 0,
);

export const selectWrittenResponseHints = createSelector(
  selectWrittenResponseTask,
  (task) => task?.content?.hints || [],
);

export const selectWrittenResponseExpectedDuration = createSelector(
  selectWrittenResponseTask,
  (task) => task?.estimatedDurationInMinutes || 0,
);
