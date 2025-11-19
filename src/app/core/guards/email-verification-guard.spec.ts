import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom, Observable } from 'rxjs';

import { emailVerificationGuard } from './email-verification-guard';
import { User, UserState, UserRole, PremiumTier } from '../models/auth.model';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAuthCheckComplete,
} from '@app/store/auth/auth.selectors';
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
            { selector: selectIsAuthCheckComplete, value: true },
            { selector: selectCurrentUser, value: null },
            { selector: selectIsAuthenticated, value: false },
          ],
        }),
        {
          provide: Router,
          useValue: {
            createUrlTree: jest.fn((commands: string[]) => ({
              toString: () => commands.join('/'),
            })),
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

  it('should BLOCK and return Login UrlTree if user is not authenticated', async () => {
    const result$ = executeGuard(dummyRoute, dummyState) as Observable<boolean | UrlTree>;
    const result = await firstValueFrom(result$);

    expect(router.createUrlTree).toHaveBeenCalledWith([APP_ROUTES.LOGIN]);
    expect(result.toString()).toContain(APP_ROUTES.LOGIN);
  });

  it('should BLOCK and return Interest Selection UrlTree if user is already verified', async () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        isVerified: true,
      }),
    );
    store.refreshState();

    const result$ = executeGuard(dummyRoute, dummyState) as Observable<boolean | UrlTree>;
    const result = await firstValueFrom(result$);

    expect(router.createUrlTree).toHaveBeenCalledWith([FULL_PAGE_ROUTES.INTEREST_SELECTION]);
    expect(result.toString()).toContain(FULL_PAGE_ROUTES.INTEREST_SELECTION);
  });

  it('should BLOCK and return Dashboard UrlTree if user is already ONBOARDED', async () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        isVerified: false,
        state: UserState.ONBOARDED,
      }),
    );
    store.refreshState();

    const result$ = executeGuard(dummyRoute, dummyState) as Observable<boolean | UrlTree>;
    const result = await firstValueFrom(result$);

    expect(router.createUrlTree).toHaveBeenCalledWith([APP_ROUTES.DASHBOARD]);
    expect(result.toString()).toContain(APP_ROUTES.DASHBOARD);
  });

  it('should ALLOW access (return true) if user is authenticated but not verified', async () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        isVerified: false,
        state: UserState.REGISTERED,
      }),
    );
    store.refreshState();

    const result$ = executeGuard(dummyRoute, dummyState) as Observable<boolean | UrlTree>;
    const result = await firstValueFrom(result$);

    expect(result).toBe(true);
  });
});
