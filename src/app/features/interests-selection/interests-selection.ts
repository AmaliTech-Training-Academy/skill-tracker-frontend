import { Component, ChangeDetectionStrategy, OnInit, signal, WritableSignal } from '@angular/core';
import { InterestsChipComponent } from '@app/shared/compomonents/interests-chip/interests-chip';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { OnboardingDataService, APP_CONSTANTS } from '@app/core';
import { AppState } from '@app/store/app.state';
import { completeOnboarding } from '@app/store/auth/auth.actions';
import { getSkills } from '@app/store/onboarding/onboarding.actions';
import { selectSkills } from '@app/store/onboarding/onboarding.selectors';

@Component({
  selector: 'app-interests-selection',
  imports: [InterestsChipComponent],
  templateUrl: './interests-selection.html',
  styleUrl: './interests-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestsSelection implements OnInit {
  public selectedBadges: WritableSignal<string[]> = signal([]);
  public badges = this.store.selectSignal(selectSkills);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private onboardingDataService: OnboardingDataService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getSkills());
  }

  public toggleBadge(id: string): void {
    if (this.selectedBadges().includes(id)) {
      this.selectedBadges.update((values) => values.filter((badge) => badge !== id));
    } else {
      this.selectedBadges.update((values) => [...values, id]);
    }
  }

  public onNext(): void {
    this.onboardingDataService.setInterests(this.selectedBadges());
    this.router.navigateByUrl(APP_CONSTANTS.FULL_PAGE_ROUTES.LEVEL_SELECTION);
  }

  public onSkip(): void {
    this.store.dispatch(completeOnboarding({ request: { skills: [] } }));
  }
}
