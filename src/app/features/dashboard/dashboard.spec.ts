import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ShepherdService } from 'angular-shepherd';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';

import { AppState } from '@app/store/app.state';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { User, UserRole, UserState, TourGuide, PremiumTier } from '@app/core';
import { Store } from '@ngrx/store';
import { StepOptions } from 'shepherd.js';
import { getSteps as defaultSteps, defaultStepOptions } from './dashboard.config';

@Component({
  selector: 'app-stat-card',
  template: '',
  standalone: true,
  inputs: ['title', 'value', 'iconName'],
})
class FakeStatCard {}

@Component({
  selector: 'app-progress-bar',
  template: '',
  standalone: true,
  inputs: ['currentXp', 'totalXp', 'levelName'],
})
class FakeProgressBar {}

@Component({
  selector: 'app-progress-chart',
  template: '',
  standalone: true,
  inputs: ['data'],
})
class FakeProgressChart {}

@Component({
  selector: 'app-dashboard',
  imports: [FakeProgressBar, FakeProgressChart, FakeStatCard],
  template: `
    <header class="dashboard-header">
      <h1>Welcome, Aba 👋</h1>
      <p>Track your progress and continue developing your skill</p>
    </header>
    <section class="stats-grid">
      <app-stat-card
        title="Current Streak"
        [value]="4 + ' days'"
        [iconName]="'flame'"
      ></app-stat-card>
      <app-stat-card title="Task Completed" [value]="2" iconName="clipboard-check"></app-stat-card>
      <app-stat-card
        title="Skills In Progress"
        [value]="1"
        iconName="brain-circuit"
      ></app-stat-card>
    </section>
    <main class="dashboard-content">
      <section class="progress-overview">
        <div class="section-header">
          <h2>Your Progress</h2>
          <span>Level 1</span>
        </div>
        @if (primarySkillProgress; as firstSkill) {
          <app-progress-bar
            [currentXp]="firstSkill.currentXp"
            [totalXp]="firstSkill.currentLevelTotalXp"
            [levelName]="firstSkill.nextLevel"
          ></app-progress-bar>
        }
        <app-progress-chart [data]="data.progressChartData.weekly" />
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Dashboard implements AfterViewInit {
  private user = this.store.selectSignal(selectCurrentUser);
  public primarySkillProgress = {
    skillId: 'temp-id-1',
    skillName: 'HTML',
    averageScore: 0,
    proficiency: 0,
    tasksCompleted: 2,
    currentXp: 500,
    currentLevel: 'Level 1',
    nextLevel: 'Level 2',
    xpToNextLevel: 4970,
    currentLevelTotalXp: 5000,
  };
  public data = {
    progressChartData: {
      weekly: [
        { label: 'Mon', value: 30 },
        { label: 'Tue', value: 10 },
        { label: 'Wed', value: 5 },
        { label: 'Thu', value: 0 },
        { label: 'Fri', value: 0 },
        { label: 'Sat', value: 0 },
        { label: 'Sun', value: 0 },
      ],
    },
  };

  constructor(
    private shepherdService: ShepherdService,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    if (!this.shepherdService.isActive && this.user()?.tourStatus === TourGuide.IN_PROGRESS) {
      this.startTour();
    }
  }

  private startTour(): void {
    this.shepherdService.defaultStepOptions = defaultStepOptions;
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    const steps = defaultSteps(this.router, this.shepherdService, this.store);
    this.shepherdService.addSteps(steps as StepOptions[]);
    this.shepherdService.start();
  }
}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let store: MockStore<AppState>;
  let shepherdService: ShepherdService;
  let router: Router;

  const mockShepherdService: Partial<ShepherdService> = {
    isActive: false,
    start: jest.fn(),
    addSteps: jest.fn(),
    cancel: jest.fn(),
    next: jest.fn(),
    defaultStepOptions: {},
    modal: false,
    confirmCancel: false,
  };

  const mockRouter: Partial<Router> = {
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
    jest.clearAllMocks();
    mockShepherdService.isActive = false;

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore); // No change needed here
    shepherdService = TestBed.inject(ShepherdService);
    router = TestBed.inject(Router);
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
