import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES } = APP_CONSTANTS;

  const user = store.selectSignal(selectCurrentUser)();

  if (!user) {
    router.navigateByUrl(APP_ROUTES.LOGIN);
    return false;
  }

  if (user.state === UserState.ONBOARDED) {
    router.navigateByUrl(APP_ROUTES.DASHBOARD);
    return false;
  }

  if (user.is_verified) {
    return true;
  }

  router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
  return false;
};
