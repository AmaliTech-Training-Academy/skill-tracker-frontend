import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-onboarding-test',
  imports: [],
  templateUrl: './onboarding-test.html',
  styleUrl: './onboarding-test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingTest {}
