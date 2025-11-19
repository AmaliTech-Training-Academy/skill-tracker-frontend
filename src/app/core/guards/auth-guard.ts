import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';

import { AppState } from '@app/store/app.state';
import { selectCurrentUser, selectIsAuthCheckComplete } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  const isAuthCheckComplete = store.selectSignal(selectIsAuthCheckComplete);
  const currentUser = store.selectSignal(selectCurrentUser);

  return toObservable(isAuthCheckComplete).pipe(
    filter((isComplete) => isComplete),
    take(1),
    map(() => {
      const user = currentUser();
      const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

      if (!user) {
        router.navigateByUrl(APP_ROUTES.LOGIN);
        return false;
      }

      if (user.state === UserState.ONBOARDED) {
        return true;
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
