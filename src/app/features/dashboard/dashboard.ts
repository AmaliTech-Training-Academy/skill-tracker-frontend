import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  signal,
  OnInit,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { StepOptions } from 'shepherd.js';
import { ShepherdService } from 'angular-shepherd';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';

import { getSteps as defaultSteps, defaultStepOptions } from './dashboard.config';
import { SkillTrajectoryData, TrajectoryGranularity } from '@app/core';
import { loadTotalUserXp } from '@app/store/tasks';

import { AppState } from '@app/store/app.state';
import {
  loadDashboardAnalytics,
  loadRecommendedTasks,
  loadDashboardTrajectory,
  loadUserSkills,
  setSelectedSkill,
  setSelectedSkillName,
} from '@app/store/dashboard/dashboard.actions';
import { startTask } from '@app/store/tasks/tasks.actions';
import {
  selectIsDashboardAnalyticsLoading,
  selectDashboardAnalyticsError,
  selectUserStats,
  selectSkillsInProgressCount,
  selectPrimarySkillProgress,
  selectRecommendedTasks,
  selectIsRecommendedTasksLoading,
  selectRecommendedTasksError,
  selectUserSkills,
  selectTrajectoryData,
  selectSelectedSkillId,
  selectSelectedSkillName,
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
  public selectedPeriod = signal(TrajectoryGranularity.WEEKLY);
  public userSkills = this.store.selectSignal(selectUserSkills);
  public trajectoryData = this.store.selectSignal(selectTrajectoryData);

  public progressChartData = computed(() => {
    const apiData = this.trajectoryData();
    const period = this.selectedPeriod();

    switch (period) {
      case TrajectoryGranularity.DAILY:
        return this.generateDailyData(apiData);

      case TrajectoryGranularity.WEEKLY:
        return this.generateWeeklyData(apiData);

      case TrajectoryGranularity.MONTHLY:
        return this.generateMonthlyData(apiData);

      default:
        return [];
    }
  });

  private generateDailyData(apiData: SkillTrajectoryData[]) {
    const startOfWeek = this.getMonday(new Date());

    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const found = apiData?.find(
        (d) => new Date(d.snapshotDate).toDateString() === date.toDateString(),
      );

      return {
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: found ? found.averageXpEarned : 0,
      };
    });
  }

  private getWeekOfMonth(date: Date): number {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay() || 7;

    return Math.ceil((date.getDate() + dayOfWeek - 1) / 7);
  }

  private generateWeeklyData(apiData: SkillTrajectoryData[]) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const weeks = [1, 2, 3, 4, 5];

    return weeks.map((week) => {
      const matchingItems = apiData?.filter((d) => {
        const dDate = new Date(d.snapshotDate);
        return (
          dDate.getFullYear() === year &&
          dDate.getMonth() === month &&
          this.getWeekOfMonth(dDate) === week
        );
      });

      const totalXp = matchingItems.reduce((sum, item) => sum + item.averageXpEarned, 0);

      return {
        label: `Week ${week}`,
        value: totalXp || 0,
      };
    });
  }

  private generateMonthlyData(apiData: SkillTrajectoryData[]) {
    const year = new Date().getFullYear();

    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return monthLabels.map((label, monthIndex) => {
      const matchingItems = apiData?.filter((d) => {
        const dDate = new Date(d.snapshotDate);
        return dDate.getFullYear() === year && dDate.getMonth() === monthIndex;
      });

      const totalXp = matchingItems.reduce((sum, item) => sum + item.averageXpEarned, 0);

      return {
        label,
        value: totalXp || 0,
      };
    });
  }

  private getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  public isDashboardAnalyticsLoading = this.store.selectSignal(selectIsDashboardAnalyticsLoading);
  public isDashboardAnalyticsError = this.store.selectSignal(selectDashboardAnalyticsError);
  public userStats = this.store.selectSignal(selectUserStats);
  public skillsInProgressCount = this.store.selectSignal(selectSkillsInProgressCount);
  public primarySkillProgress = this.store.selectSignal(selectPrimarySkillProgress);
  public isRecommendedTasksLoading = this.store.selectSignal(selectIsRecommendedTasksLoading);
  public selectRecommendedTasksError = this.store.selectSignal(selectRecommendedTasksError);
  public selectedSkillId = this.store.selectSignal(selectSelectedSkillId);
  public recommendedTasks = this.store.selectSignal(selectRecommendedTasks);
  public selectedSkillName = this.store.selectSignal(selectSelectedSkillName);

  public recommendedTasksSelectedSkillName = signal<string | null>(null);
  public progressSelectedSkillId = signal<string | null>(null);

  constructor(
    private shepherdService: ShepherdService,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getDashboardAnalytics();
    this.getUserSkills();
    this.store.dispatch(loadTotalUserXp());
  }

  ngAfterViewInit() {
    if (!this.shepherdService.isActive && this.user()?.tourStatus === TourGuide.NOT_STARTED) {
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

  public selectPeriod(period: TrajectoryGranularity): void {
    this.selectedPeriod.set(period);
  }

  public selectSkill(skill: string): void {
    this.store.dispatch(setSelectedSkill({ skillId: skill }));
  }

  public get userName(): string {
    return this.user()?.username || '';
  }

  public getDashboardAnalytics(): void {
    this.store.dispatch(loadDashboardAnalytics());
  }

  public getRecommendedTasks(): void {
    const skills = this.userSkills();
    const selectedId = this.selectedSkillId();

    const skill = skills.find((s) => s.skillId === selectedId) || skills[0];
    if (skill) {
      this.store.dispatch(loadRecommendedTasks({ skillName: skill.skillName }));
    }
  }

  public onRecommendedTasksSkillChange(skillName: string): void {
    this.recommendedTasksSelectedSkillName.set(skillName);

    this.store.dispatch(setSelectedSkillName({ skillName }));
    this.store.dispatch(loadRecommendedTasks({ skillName }));
  }

  public onSkillChange(skillId: string): void {
    this.progressSelectedSkillId.set(skillId);
    const granularity = this.selectedPeriod();

    this.store.dispatch(setSelectedSkill({ skillId }));
    this.store.dispatch(loadDashboardTrajectory({ skillId, granularity }));
  }

  public onPeriodChange(period: string): void {
    const granularity = this.mapPeriodToGranularity(period);
    this.selectedPeriod.set(granularity);

    const skillId = this.selectedSkillId();
    if (skillId) {
      this.store.dispatch(loadDashboardTrajectory({ skillId, granularity }));
    }
  }

  private mapPeriodToGranularity(period: string): TrajectoryGranularity {
    switch (period.toLowerCase()) {
      case 'daily':
        return TrajectoryGranularity.DAILY;
      case 'weekly':
        return TrajectoryGranularity.WEEKLY;
      case 'monthly':
        return TrajectoryGranularity.MONTHLY;
      default:
        return TrajectoryGranularity.WEEKLY;
    }
  }

  public getUserSkills(): void {
    this.store.dispatch(loadUserSkills());
  }

  public onStartTask(taskId: string): void {
    const task = this.recommendedTasks().find((t) => t.id === taskId);
    if (task) {
      this.store.dispatch(startTask({ taskId, taskType: task.type }));
    }
  }
}
