import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
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

  if (currentUser()?.is_verified) {
    return true;
  }

  router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
  return false;
};
