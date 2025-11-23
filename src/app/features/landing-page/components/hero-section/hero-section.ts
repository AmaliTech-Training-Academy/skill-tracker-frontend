import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  public isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  constructor(
    private router: Router,
    private store: Store,
  ) {}

  public navigateToSignup(): void {
    this.router.navigateByUrl(APP_CONSTANTS.APP_ROUTES.SIGNUP);
  }

  public navigateToDashboard(): void {
    this.router.navigateByUrl(APP_CONSTANTS.APP_ROUTES.DASHBOARD);
  }

  public scrollToFeatures(): void {
    const featuresElement = document.querySelector<HTMLElement>('app-features');
    featuresElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
