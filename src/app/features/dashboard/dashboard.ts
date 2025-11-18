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
import {
  TaskDifficulty,
  TaskIcon,
  TaskStatus,
  TaskUI,
  TaskType,
  TaskContentType,
} from '@app/core/models/tasks-model';

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
  public tasks: TaskUI[] = [
    {
      id: 't1',
      title: 'Fix The Print Statement',
      description: 'Debug and fix the print statement syntax error.',
      type: TaskType.CODING,
      difficulty: TaskDifficulty.BEGINNER,
      content: {
        contentType: TaskContentType.CODING,
        prompt: 'Fix the print statement in the given Python code.',
        hints: ['Check for missing quotes'],
        examples: [],
        constraints: 'Use Python 3 syntax',
        starterCode: 'print(Hello World)',
        testCases: [],
        evaluationCriteria: { correctness: [], efficiency: [], style: [] },
      },
      xpReward: 50,
      estimatedDuration: 15,
      skillName: 'HTML',
      version: 1,
      icon: TaskIcon.ABC,
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: 't2',
      title: 'Concept Explanation',
      description: 'Explain a key concept in your own words.',
      type: TaskType.ESSAY,
      difficulty: TaskDifficulty.BEGINNER,
      content: {
        contentType: TaskContentType.ESSAY,
        prompt: 'Explain the concept of data structures.',
        hints: ['Think about organization'],
        wordLimit: 500,
        guidelines: ['Be clear and concise'],
        rubric: ['Clarity', 'Accuracy'],
      },
      xpReward: 100,
      estimatedDuration: 15,
      skillName: 'Data Structures',
      version: 1,
      icon: TaskIcon.PENCIL,
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
