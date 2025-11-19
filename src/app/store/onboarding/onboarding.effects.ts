import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastService } from '@app/core';
import { SkillsService } from '@app/features/interests-selection/services/skills-service';
import { ErrorHandlerService } from '@app/core';
import { getSkills, getSkillsFailure, getSkillsSuccess } from './onboarding.actions';

@Injectable()
export class OnboardingEffects {
  constructor(
    private actions$: Actions,
    private skillsService: SkillsService,
    private errorHandlerService: ErrorHandlerService,
    private toastService: ToastService,
  ) {}

  public getSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSkills),
      switchMap(() =>
        this.skillsService.getSkills().pipe(
          map(({ data }) => getSkillsSuccess({ skills: data })),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(getSkillsFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public getSkillsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getSkillsFailure),
        tap(({ error }) => {
          this.toastService.showError(
            error.type?.charAt(0).toUpperCase() + error.type!.slice(1) + ' Failed',
            error.message,
          );
        }),
      ),
    { dispatch: false },
  );
}
