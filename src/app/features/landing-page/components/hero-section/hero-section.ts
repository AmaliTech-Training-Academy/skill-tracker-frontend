import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { goToLogin } from '@app/shared/utils/navigation';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss'
})
export class HeroSection {
  router = inject(Router);

  navigateToLogin(): void {
    goToLogin(this.router);
  }

}
