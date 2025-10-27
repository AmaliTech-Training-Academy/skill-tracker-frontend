import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { goToLogin } from '@app/shared/utils/navigation';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  constructor(private router: Router) {}

  public navigateToLogin(): void {
    goToLogin(this.router);
  }

  public scrollToFeatures(): void {
    const featuresElement = document.querySelector<HTMLElement>('app-features');
    featuresElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
