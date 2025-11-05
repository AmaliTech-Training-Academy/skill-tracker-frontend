import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { authGuard } from './auth-guard';
import { User, UserState, UserRole, PremiumTier } from '../models/auth.model';
import { selectCurrentUser, selectIsAuthenticated } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';

describe('authGuard', () => {
  let store: MockStore;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const createMockUser = (overrides: Partial<User>): User => {
    const defaultUser: User = {
      id: '1',
      email: 'test@example.com',
      username: 'Test User',
      role: UserRole.USER,
      state: UserState.REGISTERED,
      is_verified: false,
      premiumTier: PremiumTier.FREE,
      language: 'en',
      timezone: 'UTC',
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    return { ...defaultUser, ...overrides };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            { selector: selectCurrentUser, value: null },
            { selector: selectIsAuthenticated, value: false },
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

  it('should redirect to login if user is not authenticated', () => {
    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.LOGIN);
    expect(result).toBe(false);
  });

  it('should ALLOW access for an ONBOARDED user', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.ONBOARDED,
        is_verified: true,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should ALLOW access for a VERIFIED (but not onboarded) user', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.REGISTERED,
        is_verified: true,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(
      APP_CONSTANTS.FULL_PAGE_ROUTES.INTEREST_SELECTION,
    );
    expect(result).toBe(false);
  });

  it('should redirect to email verification for an unverified user', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.REGISTERED,
        is_verified: false,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.EMAIL_VERIFICATION);
    expect(result).toBe(false);
  });
});
