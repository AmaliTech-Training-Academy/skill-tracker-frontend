import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { AppState } from '@app/store/app.state';
import {
  selectIsAuthCheckComplete,
  selectCurrentUser,
  selectIsAuthenticated,
} from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

export const emailVerificationGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

  const isAuthCheckCompleteSig = store.selectSignal(selectIsAuthCheckComplete);
  const currentUserSig = store.selectSignal(selectCurrentUser);
  const isAuthenticatedSig = store.selectSignal(selectIsAuthenticated);

  return toObservable(isAuthCheckCompleteSig).pipe(
    filter(Boolean),
    map(() => {
      const user = currentUserSig();
      const isAuthenticated = isAuthenticatedSig();

      if (!isAuthenticated || !user) {
        return router.createUrlTree([APP_ROUTES.LOGIN]);
      }

      if (user.state === UserState.ONBOARDED) {
        return router.createUrlTree([APP_ROUTES.DASHBOARD]);
      }

      if (user.isVerified) {
        return router.createUrlTree([FULL_PAGE_ROUTES.INTEREST_SELECTION]);
      }

      return true;
    }),
  );
};
