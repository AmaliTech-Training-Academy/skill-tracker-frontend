import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState } from '../models/auth.model';

const { APP_ROUTES } = APP_CONSTANTS;

export const onboardingGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  const user = store.selectSignal(selectCurrentUser)();

  if (!user) {
    router.navigateByUrl(APP_ROUTES.LOGIN);
    return false;
  }

  switch (user.state) {
    case UserState.VERIFIED:
    case UserState.REGISTERED:
      return true;
    case UserState.ACTIVE:
      router.navigateByUrl(APP_ROUTES.DASHBOARD);
      return false;
    default:
      router.navigateByUrl(APP_ROUTES.LOGIN);
      return false;
  }
};
