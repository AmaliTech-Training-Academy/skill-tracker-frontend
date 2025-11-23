import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WrittenResponseState } from './written-response.state';

export const selectWrittenResponseState =
  createFeatureSelector<WrittenResponseState>('writtenResponse');

export const selectWrittenResponseTask = createSelector(
  selectWrittenResponseState,
  ({ task }) => task,
);

export const selectWrittenResponseLoading = createSelector(
  selectWrittenResponseState,
  ({ loading }) => loading,
);

export const selectWrittenResponseError = createSelector(
  selectWrittenResponseState,
  ({ error }) => error,
);

export const selectWrittenResponseUserAnswer = createSelector(
  selectWrittenResponseState,
  ({ userAnswer }) => userAnswer,
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

export const selectWrittenResponseSubmissionId = createSelector(
  selectWrittenResponseState,
  ({ submissionId }) => submissionId,
);

export const selectWrittenResponseSubmissionStatus = createSelector(
  selectWrittenResponseState,
  ({ submissionStatus }) => submissionStatus,
);

export const selectWrittenResponseIsSubmitting = createSelector(
  selectWrittenResponseState,
  ({ isSubmitting }) => isSubmitting,
);

export const selectWrittenResponseTaskId = createSelector(
  selectWrittenResponseState,
  ({ taskId }) => taskId,
);

export const selectWrittenResponseQuizCompleted = createSelector(
  selectWrittenResponseState,
  ({ quizCompleted }) => quizCompleted,
);
