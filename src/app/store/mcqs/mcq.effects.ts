import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as McqActions from './mcq.actions';
import { McqGenerationService } from '@app/core/services/mcqs/mcq-service';

@Injectable()
export class McqGenerationEffects {
  constructor(
    private actions$: Actions,
    private mcqService: McqGenerationService,
  ) {}

  public generateMcqQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(McqActions.generateMcqQuiz),

      switchMap((action) =>
        this.mcqService.fetchQuiz(action.request).pipe(
          map((response) => McqActions.generateMcqQuizSuccess({ response })),

          catchError((error) => {
            const errorMessage =
              error.error?.message ||
              error.message ||
              'An unknown error occurred while generating the quiz.';
            return of(
              McqActions.generateMcqQuizFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    ),
  );
}
