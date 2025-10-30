import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
import { UserState } from '../models/auth.model';
import { APP_CONSTANTS } from '../constants/app.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES } = APP_CONSTANTS;

  const currentUser = store.selectSignal(selectCurrentUser);

  if (!currentUser()) {
    router.navigateByUrl(APP_ROUTES.LOGIN);
    return false;
  }

  switch (currentUser()?.state) {
    case UserState.ACTIVE:
    case UserState.VERIFIED:
      return true;
    case UserState.REGISTERED:
      router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
      return false;
    default:
      router.navigateByUrl(APP_ROUTES.LOGIN);
      return false;
  }
};
