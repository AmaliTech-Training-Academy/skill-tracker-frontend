import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, Observable } from 'rxjs';

import { authGuard } from './auth-guard';
import { selectCurrentUser, selectIsAuthCheckComplete } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UserState, User, PremiumTier, UserRole } from '../models/auth.model';
describe('authGuard', () => {
  let store: MockStore;
  let router: jest.Mocked<Router>;

  const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/test-url' } as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => authGuard(route, state));

  function createMockUser(overrides: Partial<User> = {}): User {
    return {
      id: 'mock-user-id',
      email: 'test@example.com',
      username: 'mockuser',
      role: UserRole.USER,
      state: UserState.REGISTERED,
      isVerified: false,
      premiumTier: PremiumTier.FREE,
      language: 'en',
      timezone: 'UTC',
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      ...overrides,
    };
  }

  beforeEach(() => {
    const routerMock = {
      navigateByUrl: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { auth: { user: null, isAuthCheckComplete: false } },
        }),
        { provide: Router, useValue: routerMock },
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should wait until isAuthCheckComplete is true before proceeding', async () => {
    store.overrideSelector(selectIsAuthCheckComplete, false);
    store.overrideSelector(selectCurrentUser, null);

    const guardResult$ = executeGuard(mockRoute, mockState) as Observable<GuardResult>;

    const resultPromise = firstValueFrom(guardResult$);

    store.overrideSelector(selectIsAuthCheckComplete, true);
    store.refreshState();

    await expect(resultPromise).resolves.toBeDefined();
  });

  it('should navigate to LOGIN and return false if user is null', async () => {
    store.overrideSelector(selectIsAuthCheckComplete, true);
    store.overrideSelector(selectCurrentUser, null);
    store.refreshState();

    const result = await firstValueFrom(executeGuard(mockRoute, mockState) as Observable<boolean>);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.LOGIN);
    expect(result).toBe(false);
  });

  it('should return true if user is authenticated and ONBOARDED', async () => {
    store.overrideSelector(selectIsAuthCheckComplete, true);

    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.ONBOARDED,
        isVerified: true,
      }),
    );
    store.refreshState();

    const result = await firstValueFrom(executeGuard(mockRoute, mockState) as Observable<boolean>);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should navigate to INTEREST_SELECTION if user is verified but not onboarded', async () => {
    store.overrideSelector(selectIsAuthCheckComplete, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.REGISTERED,
        isVerified: true,
      }),
    );
    store.refreshState();

    const result = await firstValueFrom(executeGuard(mockRoute, mockState) as Observable<boolean>);

    expect(router.navigateByUrl).toHaveBeenCalledWith(FULL_PAGE_ROUTES.INTEREST_SELECTION);
    expect(result).toBe(false);
  });

  it('should navigate to EMAIL_VERIFICATION if user is not verified', async () => {
    store.overrideSelector(selectIsAuthCheckComplete, true);
    store.overrideSelector(
      selectCurrentUser,
      createMockUser({
        state: UserState.REGISTERED,
        isVerified: false,
      }),
    );
    store.refreshState();

    const result = await firstValueFrom(executeGuard(mockRoute, mockState) as Observable<boolean>);

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.EMAIL_VERIFICATION);
    expect(result).toBe(false);
  });
});
