import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsAuthCheckComplete } from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';
import { filter, map, switchMap, take } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

  return store.select(selectIsAuthCheckComplete).pipe(
    filter((isComplete) => isComplete),
    take(1),
    switchMap(() => store.select(selectCurrentUser)),
    map((user) => {
      const isAuthenticated = !!user;

      if (!isAuthenticated || !user || !user.isVerified) {
        return true;
      }

      if (user.state === UserState.ONBOARDED) {
        router.navigateByUrl(APP_ROUTES.DASHBOARD);
        return false;
      }

      if (user.isVerified) {
        router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
        return false;
      }

      router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
      return false;
    }),
  );
};
