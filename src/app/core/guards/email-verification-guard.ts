import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
import { APP_CONSTANTS } from '../constants/app.constants';

export const emailVerificationGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

  const user = store.selectSignal(AuthSelectors.selectCurrentUser)();
  const isAuthenticated = store.selectSignal(AuthSelectors.selectIsAuthenticated)();

  if (!isAuthenticated || !user) {
    router.navigateByUrl(APP_ROUTES.LOGIN);
    return false;
  }

  if (user.isVerified) {
    router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
    return false;
  }

  return true;
};
