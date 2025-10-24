import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { goToLogin } from '@app/shared/utils/navigation';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSection {
  private router = inject(Router);
  private document = inject(DOCUMENT);

  navigateToLogin(): void {
    goToLogin(this.router);
  }

  scrollToFeatures(): void {
    const featuresElement = this.document.querySelector<HTMLElement>('app-features');
    featuresElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
