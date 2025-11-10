import { ChangeDetectionStrategy, Component, AfterViewInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StepOptions } from 'shepherd.js';
import { ShepherdService } from 'angular-shepherd';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';

import { getSteps as defaultSteps, defaultStepOptions } from './dashboard.config';
import { TourGuide } from '@app/core';
import { StatCard, ProgressBar, ProgressChart } from '@app/shared';
import { TasksCard } from '../tasks-dashboard/components/tasks-card/tasks-card';
import { CustomDropdown } from '@app/shared/components/custom-dropdown/custom-dropdown';
import { TaskDifficulty, TaskIcon, TaskStatus } from '@app/core/models/tasks-model';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [StatCard, ProgressBar, ProgressChart, TasksCard, CustomDropdown],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements AfterViewInit {
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
  public tasks = [
    {
      id: 't1',
      title: 'Fix The Print Statement',
      icon: TaskIcon.ABC,
      description: 'Assess your knowledge in this skill area.',
      skill: 'HTML',
      difficulty: TaskDifficulty.BEGINNER,
      xp: 0,
      time: '15 min',
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: 't2',
      title: 'Concept Explanation',
      icon: TaskIcon.PENCIL,
      description: 'Explain a key concept in your own words.',
      skill: 'Data Structures',
      difficulty: TaskDifficulty.BEGINNER,
      xp: 0,
      time: '15 min',
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
  ];

  public selectedPeriod = signal('weekly');

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

  public selectPeriod(period: string): void {
    this.selectedPeriod.set(period);
  }
}
