import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import * as AuthSelectors from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES } = APP_CONSTANTS;

  return combineLatest([
    store.select(AuthSelectors.selectIsAuthenticated),
    store.select(AuthSelectors.selectCurrentUser)
  ]).pipe(
    take(1),
    map(([isAuthenticated, user]) => {
      if (isAuthenticated && user?.state === UserState.ACTIVE) {
        router.navigateByUrl(APP_ROUTES.DASHBOARD);
        return false;
      }

      return true;
    }),
  );
};
