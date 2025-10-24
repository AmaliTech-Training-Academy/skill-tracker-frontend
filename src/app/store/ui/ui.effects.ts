import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as UIActions from './ui.actions';

@Injectable()
export class UIEffects {
  private readonly DEFAULT_DURATION = 4000;
  private readonly EXIT_ANIMATION_DURATION = 300;
  private actions$ = inject(Actions);

  showToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UIActions.showToast),
      switchMap(() => timer(this.DEFAULT_DURATION).pipe(map(() => UIActions.startToastExit()))),
    ),
  );

  startToastExit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UIActions.startToastExit),
      switchMap(() => timer(this.EXIT_ANIMATION_DURATION).pipe(map(() => UIActions.hideToast()))),
    ),
  );
}
