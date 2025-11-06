import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { emailVerificationGuard } from './email-verification-guard';
import { User, UserState, UserRole, PremiumTier } from '../models/auth.model';
import { selectCurrentUser, selectIsAuthenticated } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';

describe('emailVerificationGuard', () => {
  let store: MockStore;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;
  const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => emailVerificationGuard(...guardParameters));

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

  it('should BLOCK and redirect to login if user is not authenticated', () => {
    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.LOGIN);
    expect(result).toBe(false);
  });

  it('should BLOCK and redirect to interest selection if user is already verified', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        isVerified: true,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).toHaveBeenCalledWith(FULL_PAGE_ROUTES.INTEREST_SELECTION);
    expect(result).toBe(false);
  });

  it('should ALLOW access if user is authenticated but not verified', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        isVerified: false,
      }),
    );

    const result = executeGuard(dummyRoute, dummyState);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
