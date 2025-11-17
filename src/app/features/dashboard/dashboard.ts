import { ChangeDetectionStrategy, Component, AfterViewInit, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepOptions } from 'shepherd.js';
import { ShepherdService } from 'angular-shepherd';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';

import { getSteps as defaultSteps, defaultStepOptions } from './dashboard.config';

import { AppState } from '@app/store/app.state';
import {
  loadDashboardAnalytics,
  loadRecommendedTasks,
} from '@app/store/dashboard/dashboard.actions';
import {
  selectIsDashboardAnalyticsLoading,
  selectDashboardAnalyticsError,
  selectUserStats,
  selectSkillsInProgressCount,
  selectPrimarySkillProgress,
  selectRecommendedTasks,
  selectIsRecommendedTasksLoading,
  selectRecommendedTasksError,
} from '@app/store/dashboard/dashboard.selectors';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';

import {
  DashboardErrorComponent,
  DashboardHeaderComponent,
  DashboardStatsContainer,
  DashboardRecommendedTasks,
  StatsCardSkeleton,
  DashboardProgressOverviewComponent,
} from '@app/features/dashboard';
import { TourGuide } from '@app/core';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    DashboardErrorComponent,
    DashboardHeaderComponent,
    DashboardProgressOverviewComponent,
    LucideAngularModule,
    DashboardStatsContainer,
    DashboardRecommendedTasks,
    StatsCardSkeleton,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit, AfterViewInit {
  private user = this.store.selectSignal(selectCurrentUser);
  public selectedPeriod = signal('weekly');

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

  public isDashboardAnalyticsLoading = this.store.selectSignal(selectIsDashboardAnalyticsLoading);
  public isDashboardAnalyticsError = this.store.selectSignal(selectDashboardAnalyticsError);
  public userStats = this.store.selectSignal(selectUserStats);
  public skillsInProgressCount = this.store.selectSignal(selectSkillsInProgressCount);
  public primarySkillProgress = this.store.selectSignal(selectPrimarySkillProgress);
  public recommendedTasks = this.store.selectSignal(selectRecommendedTasks);
  public isRecommendedTasksLoading = this.store.selectSignal(selectIsRecommendedTasksLoading);
  public selectRecommendedTasksError = this.store.selectSignal(selectRecommendedTasksError);

  constructor(
    private shepherdService: ShepherdService,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit() {
    this.store.dispatch(loadDashboardAnalytics());
    this.store.dispatch(loadRecommendedTasks());
  }

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

  public selectPeriod(period: string): void {
    this.selectedPeriod.set(period);
  }

  public getUserName(): string {
    return this.user()?.username || '';
  }
}
