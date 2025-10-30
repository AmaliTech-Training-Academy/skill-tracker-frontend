import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { authGuard } from './auth-guard';
import { User, UserState, UserRole, PremiumTier, TourGuide } from '../models/auth.model';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';

describe('authGuard', () => {
  let store: MockStore;
  let router: Router;
  const { APP_ROUTES } = APP_CONSTANTS;

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
      state: UserState.ACTIVE,
      tourStatus: TourGuide.COMPLETED,
      is_verified: true,
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

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.LOGIN);
    expect(result).toBe(false);
  });

  it('should allow access for an ACTIVE user', () => {
    store.overrideSelector(selectCurrentUser, createMockUser({ state: UserState.ACTIVE }));

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should allow access for a VERIFIED user', () => {
    store.overrideSelector(selectCurrentUser, createMockUser({ state: UserState.VERIFIED }));

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should redirect to email verification for a REGISTERED user', () => {
    store.overrideSelector(selectCurrentUser, createMockUser({ state: UserState.REGISTERED }));

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.EMAIL_VERIFICATION);
    expect(result).toBe(false);
  });
});
