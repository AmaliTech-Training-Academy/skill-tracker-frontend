import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as UIActions from './ui.actions';

const DEFAULT_DURATION = 4000;
const EXIT_ANIMATION_DURATION = 300;

@Injectable()
export class UIEffects {
  constructor(private actions$: Actions) {}

  public showToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UIActions.showToast),
      switchMap(() => timer(DEFAULT_DURATION).pipe(map(() => UIActions.startToastExit()))),
    ),
  );

  public startToastExit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UIActions.startToastExit),
      switchMap(() => timer(EXIT_ANIMATION_DURATION).pipe(map(() => UIActions.hideToast()))),
    ),
  );
}
