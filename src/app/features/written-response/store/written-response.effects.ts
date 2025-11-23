import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { ToastService } from '@app/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as WrittenResponseActions from './written-response.action';
import { WrittenResponseService } from './written-response-service';

@Injectable()
export class WrittenResponseEffects {
  constructor(
    private actions$: Actions,
    private writtenResponseService: WrittenResponseService,
    private toastService: ToastService,
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

  private extractErrorMessage(
    error: { error?: { message?: string }; message?: string },
    defaultMessage: string,
  ): string {
    return error.error?.message || error.message || defaultMessage;
  }
}
