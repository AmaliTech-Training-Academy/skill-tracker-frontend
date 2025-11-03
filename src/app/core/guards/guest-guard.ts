import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES } = APP_CONSTANTS;

  const isAuthenticated = store.selectSignal(AuthSelectors.selectIsAuthenticated);
  const user = store.selectSignal(AuthSelectors.selectCurrentUser);

  if (isAuthenticated() && user()?.state === UserState.ACTIVE) {
    router.navigateByUrl(APP_ROUTES.DASHBOARD);
    return false;
  }

  return true;
};
