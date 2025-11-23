import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, timer, from } from 'rxjs';
import { ToastService } from '@app/core';
import { catchError, map, switchMap, tap, filter, takeUntil } from 'rxjs/operators';
import * as WrittenResponseActions from './written-response.action';
import { WrittenResponseService } from './written-response-service';
import { TaskService } from '@app/features/tasks-dashboard/services/task.service';
import { loadTasks } from '@app/store/tasks/tasks.actions';
import { Store } from '@ngrx/store';
import { ApiResponse } from '@app/core';
import { SubmissionResponse } from '@app/core/models/tasks-model';

const POLLING_INTERVAL_MS = 2000;

@Injectable()
export class WrittenResponseEffects {
  constructor(
    private actions$: Actions,
    private writtenResponseService: WrittenResponseService,
    private toastService: ToastService,
    private taskService: TaskService,
    private store: Store,
  ) {}

  public loadWrittenResponseTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WrittenResponseActions.loadWrittenResponseTask),
      switchMap(({ taskId }) =>
        this.writtenResponseService.fetchWrittenResponseTask(taskId).pipe(
          map(({ data }) =>
            WrittenResponseActions.loadWrittenResponseTaskSuccess({
              task: data,
            }),
          ),
          catchError((error) =>
            of(
              WrittenResponseActions.loadWrittenResponseTaskFailure({
                error: this.extractErrorMessage(
                  error,
                  'An unknown error occurred while loading the written response task.',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  public submitWrittenResponseTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WrittenResponseActions.submitWrittenResponseTask),
      switchMap(({ taskId, answer }) =>
        this.writtenResponseService
          .submitWrittenResponse({
            taskId,
            answer: {
              answerType: 'ESSAY',
              submissionText: answer,
            },
          })
          .pipe(
            map((response) =>
              WrittenResponseActions.submitWrittenResponseTaskSuccess({ response }),
            ),
            catchError((error) =>
              of(
                WrittenResponseActions.submitWrittenResponseTaskFailure({
                  error: this.extractErrorMessage(
                    error,
                    'An unknown error occurred while submitting the task.',
                  ),
                }),
              ),
            ),
          ),
      ),
    ),
  );

  public completeQuizOnSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WrittenResponseActions.submitWrittenResponseTaskSuccess),
      map(() => WrittenResponseActions.completeWrittenResponseQuiz()),
    ),
  );

  public autoRequestFeedback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WrittenResponseActions.submitWrittenResponseTaskSuccess),
      map(({ response }) =>
        WrittenResponseActions.getWrittenResponseSubmissionStatus({
          submissionId: response.data.submissionId,
        }),
      ),
    ),
  );

  public getSubmissionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WrittenResponseActions.getWrittenResponseSubmissionStatus),
      switchMap(({ submissionId }) =>
        this.writtenResponseService.getSubmissionStatus(submissionId).pipe(
          switchMap((response) => this.handleSubmissionStatusResponse(response)),
          catchError((error) => {
            this.toastService.showError('Status Error', 'Failed to get submission status');
            return of(
              WrittenResponseActions.getWrittenResponseSubmissionStatusFailure({
                error: 'Failed to get submission status',
              }),
            );
          }),
        ),
      ),
    ),
  );

  public pollSubmissionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WrittenResponseActions.getWrittenResponseSubmissionStatusSuccess),
      filter(({ submission }) => this.taskService.shouldPollStatus(submission)),
      switchMap(({ submission }) =>
        timer(0, POLLING_INTERVAL_MS).pipe(
          map(() =>
            WrittenResponseActions.getWrittenResponseSubmissionStatus({
              submissionId: submission.id,
            }),
          ),
          takeUntil(
            this.actions$.pipe(
              ofType(WrittenResponseActions.getWrittenResponseSubmissionStatusSuccess),
              filter(({ submission }) => !this.taskService.shouldPollStatus(submission)),
            ),
          ),
        ),
      ),
    ),
  );

  public submitSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WrittenResponseActions.submitWrittenResponseTaskSuccess),
        tap(() => {
          this.toastService.showSuccess('Success', 'Solution Submitted successfully');
        }),
      ),
    { dispatch: false },
  );

  public submitFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WrittenResponseActions.submitWrittenResponseTaskFailure),
        tap(() => {
          this.toastService.showError('Submission Failed', 'Something went wrong, try again');
        }),
      ),
    { dispatch: false },
  );

  private handleSubmissionStatusResponse(response: ApiResponse<SubmissionResponse>) {
    if (this.taskService.shouldReloadTasks(response.data)) {
      return from([
        WrittenResponseActions.getWrittenResponseSubmissionStatusSuccess({
          submission: response.data,
        }),
        loadTasks(),
        WrittenResponseActions.completeWrittenResponseQuiz(),
      ]);
    }
    return of(
      WrittenResponseActions.getWrittenResponseSubmissionStatusSuccess({
        submission: response.data,
      }),
    );
  }

  private extractErrorMessage(
    error: { error?: { message?: string }; message?: string },
    defaultMessage: string,
  ): string {
    return error.error?.message || error.message || defaultMessage;
  }
}
