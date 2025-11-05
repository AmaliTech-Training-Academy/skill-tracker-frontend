import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsAuthenticated } from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

  const user = store.selectSignal(selectCurrentUser)();
  const isAuthenticated = store.selectSignal(selectIsAuthenticated)();

  if (!isAuthenticated || !user) {
    router.navigateByUrl(APP_ROUTES.LOGIN);
    return false;
  }

  if (user.state === UserState.ONBOARDED) {
    return true;
  }

  if (user.is_verified) {
    router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
    return false;
  }

  router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
  return false;
};
