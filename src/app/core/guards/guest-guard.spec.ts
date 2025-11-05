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
import { User, UserState, UserRole, PremiumTier, TourGuide } from '../models/auth.model';

describe('guestGuard', () => {
  let store: MockStore;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;
  const { APP_ROUTES } = APP_CONSTANTS;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  const createMockUser = (overrides: Partial<User>): User => {
    const defaultUser: User = {
      id: '1',
      email: 'test@example.com',
      username: 'Test User',
      role: UserRole.USER,
      state: UserState.REGISTERED,
      isVerified: false,
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

  it('should BLOCK and redirect to dashboard for an ACTIVE user', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.ONBOARDED,
        isVerified: true,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.DASHBOARD);
    expect(result).toBe(false);
  });
});
