import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  WritableSignal,
  signal,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OnboardingDataService, SkillLevel, UserSkill } from '@app/core';
import { selectIsCompletingOnboarding } from '@app/store/auth/auth.selectors';
import {
  completeOnboarding,
  completeOnboardingFailure,
  completeOnboardingSuccess,
} from '@app/store/auth/auth.actions';
import { SkillLevelSelectorComponent } from '@app/shared/compomonents/skill-level-selector/skill-level-selector';
import { APP_CONSTANTS } from '@app/core';

const CONFETTI_DURATION = 3000;
const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

const ALL_INTERESTS_MAP = new Map<string, { name: string; icon: string }>([
  ['htmlcss', { name: 'HTML & CSS (Web Basics)', icon: '/assets/htmlcss-icon.png' }],
  ['javascript', { name: 'JavaScript', icon: '/assets/js-icon.png' }],
  ['python', { name: 'Python', icon: '/assets/python-icon.png' }],
  ['csharp', { name: 'C#', icon: '/assets/csharp-icon.png' }],
  ['sql', { name: 'SQL', icon: '/assets/sql-icon.png' }],
  [
    'frontend-development',
    { name: 'Frontend Development', icon: '/assets/frontend-development-icon.png' },
  ],
  [
    'android-development',
    { name: 'Android Development', icon: '/assets/android-development-icon.png' },
  ],
  [
    'backend-development',
    { name: 'Backend Development', icon: '/assets/frontend-development-icon.png' },
  ],
  ['git-github', { name: 'Git & GitHub', icon: '/assets/github-icon.png' }],
  [
    'algorithms-datastructures',
    { name: 'Algorithm & Data Structures', icon: '/assets/algorithms-datastructures-icon.png' },
  ],
  ['debugging', { name: 'Debugging', icon: '/assets/debugging-icon.png' }],
  ['api', { name: 'API Usage', icon: '/assets/api-icon.png' }],
  ['cloudbasis', { name: 'Cloud Basics', icon: '/assets/cloudbasis-icon.png' }],
  [
    'game-development-basics',
    { name: 'Game Development Basics', icon: '/assets/game-development-basics-icon.png' },
  ],
  [
    'technical-communication',
    { name: 'Technical Communication', icon: '/assets/technical-communication-icon.png' },
  ],
  ['databases', { name: 'Database Basics', icon: '/assets/htmlcss-icon.png' }],
  [
    'fullstack-development',
    { name: 'Full Stack Development', icon: '/assets/fullstack-development-icon.png' },
  ],
  ['uiux-basics', { name: 'UI/UX Basics for Developers', icon: '/assets/uiux-basics-icon.png' }],
]);

@Component({
  selector: 'app-level-selection',
  imports: [SkillLevelSelectorComponent],
  templateUrl: './level-selection.html',
  styleUrl: './level-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSelection implements OnInit, OnDestroy {
  public isComplete: WritableSignal<boolean> = signal(false);
  private confettiTimeoutId?: ReturnType<typeof setTimeout>;

  public isSubmitting = this.store.selectSignal(selectIsCompletingOnboarding);

  public skills = this.onboardingDataService.skills;
  public levels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private router: Router,
    private location: Location,
    private onboardingDataService: OnboardingDataService,
    private store: Store,
    private actions$: Actions,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    if (!this.skills().length) {
      this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
    }

    this.handleCompletionState();
  }

  public getSkillInfo(skillId: string): { name: string; icon: string } {
    return ALL_INTERESTS_MAP.get(skillId) || { name: skillId, icon: '❓' };
  }

  public onLevelSelect(skill: UserSkill, newLevel: SkillLevel | null) {
    this.onboardingDataService.updateSkillLevel(skill.skillId, newLevel);
  }

  public onSkip() {
    if (this.isSubmitting()) return;
    const payload = this.onboardingDataService.getUserStatePayLoad(true);
    this.store.dispatch(completeOnboarding({ request: payload }));
  }

  public onNext() {
    if (this.isSubmitting()) return;
    const payload = this.onboardingDataService.getUserStatePayLoad(false);
    this.store.dispatch(completeOnboarding({ request: payload }));
  }

  public goBack(): void {
    this.location.back();
  }

  public navigateToDashboard(): void {
    this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
  }

  public celebrate() {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
    });

    this.confettiTimeoutId = setTimeout(() => confetti.reset(), CONFETTI_DURATION);
  }

  private handleCompletionState(): void {
    this.actions$
      .pipe(ofType(completeOnboardingSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isComplete.set(true);
        this.celebrate();
      });
    this.actions$
      .pipe(ofType(completeOnboardingFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
      });
  }

  public ngOnDestroy(): void {
    clearTimeout(this.confettiTimeoutId);
    if (this.isComplete()) {
      this.onboardingDataService.reset();
    }
  }
}
