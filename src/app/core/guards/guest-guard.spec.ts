import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { guestGuard } from './guest-guard';
import { selectIsAuthenticated } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';

describe('guestGuard', () => {
  let store: MockStore;
  let router: Router;
  const { APP_ROUTES } = APP_CONSTANTS;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [{ selector: selectIsAuthenticated, value: false }],
        }),
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
          },
        },
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access for an unauthenticated user', () => {
    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should redirect to dashboard for an authenticated user', () => {
    store.overrideSelector(selectIsAuthenticated, true);

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.DASHBOARD);
    expect(result).toBe(false);
  });
});
