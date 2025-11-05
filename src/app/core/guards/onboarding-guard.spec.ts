import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { onboardingGuard } from './onboarding-guard';
import { User, UserState, UserRole, PremiumTier } from '../models/auth.model';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';

describe('onboardingGuard', () => {
  let store: MockStore;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  const { APP_ROUTES } = APP_CONSTANTS;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => onboardingGuard(...guardParameters));

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
          selectors: [{ selector: selectCurrentUser, value: null }],
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

  it('should allow access for a VERIFIED user', () => {
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({ state: UserState.REGISTERED, is_verified: true }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should BLOCK and redirect to dashboard for an ONBOARDED user', () => {
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.ONBOARDED,
        is_verified: true,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.DASHBOARD);
    expect(result).toBe(false);
  });

  it('should BLOCK and redirect to email verification for a REGISTERED (and unverified) user', () => {
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.REGISTERED,
        is_verified: false,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.EMAIL_VERIFICATION);
    expect(result).toBe(false);
  });
});
