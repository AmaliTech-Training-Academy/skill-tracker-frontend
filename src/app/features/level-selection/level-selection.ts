import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  WritableSignal,
  signal,
  DestroyRef,
  computed,
  OnInit,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { APP_CONSTANTS, OnboardingDataService, SkillLevel, UserSkill } from '@app/core';
import { selectIsCompletingOnboarding } from '@app/store/auth/auth.selectors';
import {
  completeOnboarding,
  completeOnboardingFailure,
  completeOnboardingSuccess,
} from '@app/store/auth/auth.actions';
import { selectSkills } from '@app/store/onboarding/onboarding.selectors';
import { SkillLevelSelectorComponent } from '@app/shared/compomonents/skill-level-selector/skill-level-selector';

const CONFETTI_DURATION = 3000;
const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

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
  public allSkills = this.store.selectSignal(selectSkills);

  public skills = this.onboardingDataService.skills;
  public levels: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  private skillInfoMap = computed(() => {
    const map = new Map<string, { name: string; icon: string }>();
    this.allSkills().forEach((skill) => {
      map.set(skill.id, {
        name: skill.name,
        icon: skill.iconUrl,
      });
    });
    return map;
  });

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

  public areAllLevelsSelected = computed(() => {
    if (!this.skills().length) {
      return false;
    }
    return this.skills().every((skill) => skill.level !== null);
  });

  public getSkillInfo(skillId: string): { name: string; icon: string } {
    return this.skillInfoMap().get(skillId) || { name: skillId, icon: '❓' };
  }

  public onLevelSelect(skill: UserSkill, newLevel: SkillLevel | null) {
    this.onboardingDataService.updateSkillLevel(skill.skillId, newLevel);
  }

  public onNext() {
    if (this.isSubmitting()) return;
    const payload = this.onboardingDataService.getPayload(false);
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
