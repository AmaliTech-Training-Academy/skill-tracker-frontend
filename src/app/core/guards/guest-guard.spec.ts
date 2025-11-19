import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  GuardResult,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom, Observable } from 'rxjs';

import { guestGuard } from './guest-guard';
import { selectCurrentUser, selectIsAuthCheckComplete } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '../constants/app.constants';
import { User, UserState, UserRole, PremiumTier } from '../models/auth.model';

describe('guestGuard', () => {
  let store: MockStore;
  let router: jest.Mocked<Router>;

  const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => guestGuard(route, state));

  const createMockUser = (overrides: Partial<User> = {}): User => {
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
    const routerMock = {
      navigateByUrl: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { auth: { user: null, isAuthCheckComplete: false } },
        }),
        {
          provide: Router,
          useValue: routerMock,
        },
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

  it('should ALLOW access (return true) for an unauthenticated user (Guest)', async () => {
    store.overrideSelector(selectIsAuthCheckComplete, true);
    store.overrideSelector(selectCurrentUser, null);
    store.refreshState();

    const result = await firstValueFrom(executeGuard(mockRoute, mockState) as Observable<boolean>);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should BLOCK and redirect to DASHBOARD if user is ONBOARDED', async () => {
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

    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.DASHBOARD);
    expect(result).toBe(false);
  });

  it('should BLOCK and redirect to INTEREST_SELECTION if user is verified but NOT onboarded', async () => {
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
});
