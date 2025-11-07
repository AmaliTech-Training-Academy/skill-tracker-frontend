import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ShepherdService } from 'angular-shepherd';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { Dashboard } from './dashboard';
import { AppState } from '@app/store/app.state';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { User, UserRole, UserState, TourGuide, PremiumTier } from '@app/core';
import { appIcons } from '@app/core';

jest.mock('./dashboard.config', () => ({
  defaultStepOptions: {},
  getSteps: jest.fn(() => []),
}));

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let store: MockStore<AppState>;
  let shepherdService: ShepherdService;

  const mockShepherdService = {
    isActive: false,
    start: jest.fn(),
    addSteps: jest.fn(),
    defaultStepOptions: {},
    modal: false,
    confirmCancel: false,
  };

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const createMockUser = (tourStatus: TourGuide | undefined): User => ({
    id: '1',
    email: 'test@example.com',
    username: 'Test User',
    role: UserRole.USER,
    state: UserState.ONBOARDED,
    isVerified: true,
    premiumTier: PremiumTier.FREE,
    language: 'en',
    timezone: 'UTC',
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    tourStatus,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: ShepherdService, useValue: mockShepherdService },
        { provide: Router, useValue: mockRouter },
        provideMockStore({
          selectors: [
            {
              selector: selectCurrentUser,
              value: createMockUser(TourGuide.COMPLETED),
            },
          ],
        }),
        importProvidersFrom(LucideAngularModule.pick(appIcons)),
      ],
    })
      .overrideComponent(Dashboard, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    shepherdService = TestBed.inject(ShepherdService);

    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should START the tour if the user tourStatus is IN_PROGRESS', () => {
    store.overrideSelector(selectCurrentUser, createMockUser(TourGuide.IN_PROGRESS));
    shepherdService.isActive = false;

    component.ngAfterViewInit();

    expect(shepherdService.start).toHaveBeenCalled();
  });

  it('should NOT start the tour if the user tourStatus is COMPLETED', () => {
    store.overrideSelector(selectCurrentUser, createMockUser(TourGuide.COMPLETED));
    shepherdService.isActive = false;

    component.ngAfterViewInit();

    expect(shepherdService.start).not.toHaveBeenCalled();
  });

  it('should NOT start the tour if the service is already active', () => {
    store.overrideSelector(selectCurrentUser, createMockUser(TourGuide.IN_PROGRESS));

    shepherdService.isActive = true;

    component.ngAfterViewInit();

    expect(shepherdService.start).not.toHaveBeenCalled();
  });
});
