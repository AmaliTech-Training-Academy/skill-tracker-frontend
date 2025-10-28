import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  constructor(private router: Router) {}

  public navigateToLogin(): void {
    this.router.navigateByUrl(APP_CONSTANTS.APP_ROUTES.LOGIN);
  }

  public scrollToFeatures(): void {
    const featuresElement = document.querySelector<HTMLElement>('app-features');
    featuresElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
