import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import * as AuthSelectors from '@app/store/auth/auth.selectors';
import { AppState } from '@app/store/app.state';
import { APP_CONSTANTS } from '../constants/app.constants';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const { APP_ROUTES } = APP_CONSTANTS;

  return store.select(AuthSelectors.selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigateByUrl(APP_ROUTES.DASHBOARD);
        return false;
      }

      return true;
    }),
  );
};
