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

      switchMap((action) =>
        this.writtenResponseService.fetchWrittenResponseTask(action.taskId).pipe(
          map((response) =>
            WrittenResponseActions.loadWrittenResponseTaskSuccess({
              task: response.data,
            }),
          ),

          catchError((error) => {
            const errorMessage =
              error.error?.message ||
              error.message ||
              'An unknown error occurred while loading the written response task.';
            return of(
              WrittenResponseActions.loadWrittenResponseTaskFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    ),
  );

  public submitWrittenResponseTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WrittenResponseActions.submitWrittenResponseTask),
      switchMap((action) =>
        this.writtenResponseService
          .submitWrittenResponse({
            taskId: action.taskId,
            answer: {
              answerType: 'ESSAY',
              submissionText: action.answer,
            },
          })
          .pipe(
            map((response) =>
              WrittenResponseActions.submitWrittenResponseTaskSuccess({ response }),
            ),
            catchError((error) => {
              const errorMessage =
                error.error?.message ||
                error.message ||
                'An unknown error occurred while submitting the task.';
              return of(
                WrittenResponseActions.submitWrittenResponseTaskFailure({
                  error: errorMessage,
                }),
              );
            }),
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
}
