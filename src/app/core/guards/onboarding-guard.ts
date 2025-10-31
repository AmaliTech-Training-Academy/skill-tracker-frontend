import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '@app/store/app.state';
import * as AuthSelectors from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES } = APP_CONSTANTS;

  return store.select(AuthSelectors.selectCurrentUser).pipe(
    take(1),
    map((user) => {
      if (!user) {
        router.navigateByUrl(APP_ROUTES.LOGIN);
        return false;
      }

      switch (user.state) {
        case UserState.VERIFIED:
        case UserState.REGISTERED:
          // Allow both VERIFIED and REGISTERED users to access onboarding
          // REGISTERED users who verified email should be able to proceed
          return true;
        case UserState.ACTIVE:
          router.navigateByUrl(APP_ROUTES.DASHBOARD);
          return false;
        default:
          router.navigateByUrl(APP_ROUTES.LOGIN);
          return false;
      }
    }),
  );
};
