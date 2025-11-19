import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { selectCurrentUser, selectIsAuthCheckComplete } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';
import { filter, map, switchMap, take } from 'rxjs';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES } = APP_CONSTANTS;

  return store.select(selectIsAuthCheckComplete).pipe(
    filter((isComplete) => isComplete),
    take(1),
    switchMap(() => store.select(selectCurrentUser)),
    map((user) => {
      if (!user) {
        router.navigateByUrl(APP_ROUTES.LOGIN);
        return false;
      }

      if (user.state === UserState.ONBOARDED) {
        router.navigateByUrl(APP_ROUTES.DASHBOARD);
        return false;
      }

      if (user.isVerified) {
        return true;
      }

      router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
      return false;
    }),
  );
};
