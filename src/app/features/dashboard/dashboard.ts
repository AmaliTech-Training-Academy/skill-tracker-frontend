import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepOptions } from 'shepherd.js';
import { ShepherdService } from 'angular-shepherd';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';

import { getSteps as defaultSteps, defaultStepOptions } from './dashboard.config';
import { TourGuide } from '@app/core';
import { ProgressBar } from '@app/shared/components/progress-bar/progress-bar';

@Component({
  selector: 'app-dashboard',
  imports: [ProgressBar],
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
