import { createReducer, on } from '@ngrx/store';
import * as WrittenResponseActions from './written-response.action';
import { initialWrittenResponseState, WrittenResponseState } from './written-response.state';

export const writtenResponseReducer = createReducer(
  initialWrittenResponseState,

  on(
    WrittenResponseActions.loadWrittenResponseTask,
    (state): WrittenResponseState => ({
      ...state,
      loading: true,
      error: null,
      task: null,
    }),
  ),

  on(
    WrittenResponseActions.loadWrittenResponseTaskSuccess,
    (state, { task }): WrittenResponseState => ({
      ...state,
      task,
      loading: false,
      error: null,
    }),
  ),

  on(
    WrittenResponseActions.loadWrittenResponseTaskFailure,
    (state, { error }): WrittenResponseState => ({
      ...state,
      error,
      loading: false,
      task: null,
    }),
  ),

  on(
    WrittenResponseActions.updateWrittenResponseUserAnswer,
    (state, { answer }): WrittenResponseState => ({
      ...state,
      userAnswer: answer,
    }),
  ),

  on(
    WrittenResponseActions.clearWrittenResponseState,
    (): WrittenResponseState => ({
      ...initialWrittenResponseState,
    }),
  ),
  on(WrittenResponseActions.submitWrittenResponseTask, (state) => ({
    ...state,
    isSubmitting: true,
    error: null,
  })),

  on(WrittenResponseActions.submitWrittenResponseTaskSuccess, (state, { response }) => ({
    ...state,
    isSubmitting: false,
    submissionId: response.data.submissionId,
    submissionStatus: response.data.status,
  })),

  on(WrittenResponseActions.submitWrittenResponseTaskFailure, (state, { error }) => ({
    ...state,
    isSubmitting: false,
    error,
  })),

  on(WrittenResponseActions.completeWrittenResponseQuiz, (state) => ({
    ...state,
    quizCompleted: true,
  })),

  on(WrittenResponseActions.loadWrittenResponseTask, (state, { taskId }) => ({
    ...state,
    taskId,
    loading: true,
    error: null,
  })),
  on(WrittenResponseActions.reviewWrittenResponseTask, (state) => ({
    ...state,
    quizCompleted: false,
  })),

  on(WrittenResponseActions.getWrittenResponseSubmissionStatusSuccess, (state, { submission }) => ({
    ...state,
    submission,
    feedback: submission.feedback,
    submissionStatus: submission.status,
  })),

  on(WrittenResponseActions.getWrittenResponseSubmissionStatusFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
