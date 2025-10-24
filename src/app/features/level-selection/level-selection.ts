import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  WritableSignal,
  signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';

const LOADING_DURATION = 2000;
const CONFETTI_DURATION = 3000;

@Component({
  selector: 'app-level-selection',
  standalone: true,
  templateUrl: './level-selection.html',
  styleUrl: './level-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSelection implements OnDestroy {
  public isLoading: WritableSignal<boolean> = signal(false);
  public isComplete: WritableSignal<boolean> = signal(false);

  private loadingTimeoutId?: ReturnType<typeof setTimeout>;
  private confettiTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  public startLoading() {
    this.isLoading.set(true);

    this.loadingTimeoutId = setTimeout(() => {
      this.isLoading.set(false);

      if (this.isComplete()) {
        this.celebrate();
      }
    }, LOADING_DURATION);
  }

  public ngOnDestroy(): void {
    clearTimeout(this.loadingTimeoutId);
    clearTimeout(this.confettiTimeoutId);
  }

  public onNext() {
    this.isComplete.set(true);
    this.startLoading();
  }

  public onSkip() {
    this.navigateToDashboard();
  }

  public navigateToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  public goBack(): void {
    this.location.back();
  }

  public celebrate() {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
    });

    this.confettiTimeoutId = setTimeout(() => confetti.reset(), CONFETTI_DURATION);
  }
}
