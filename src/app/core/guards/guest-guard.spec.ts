import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { guestGuard } from './guest-guard';
import { selectIsAuthenticated, selectCurrentUser } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { User, UserState, UserRole, PremiumTier } from '../models/auth.model';

describe('guestGuard', () => {
  let store: MockStore;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectIsAuthenticated, value: false },
            { selector: selectCurrentUser, value: null },
          ],
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

    const mockActiveUser: User = {
      id: 'mock-id-123',
      email: 'test@example.com',
      username: 'mock-user',
      role: 'USER' as UserRole,
      state: UserState.ACTIVE,
      is_verified: true,
      premiumTier: 'FREE' as PremiumTier,
      language: 'en',
      timezone: 'UTC',
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    store.overrideSelector(selectCurrentUser, mockActiveUser);

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.DASHBOARD);
    expect(result).toBe(false);
  });
});
