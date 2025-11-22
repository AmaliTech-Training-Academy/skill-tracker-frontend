import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as WrittenResponseActions from './written-response.action';
import { WrittenResponseService } from './written-response-service';

@Injectable()
export class WrittenResponseEffects {
  constructor(
    private actions$: Actions,
    private writtenResponseService: WrittenResponseService,
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
}