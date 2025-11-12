import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';

export interface PricingPlan {
  name: string;
  tagline: string;
  price: number;
  period: string;
  isPopular: boolean;
  features: string[];
}

@Component({
  selector: 'app-pricing-card',
  imports: [CurrencyPipe],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingCard {
  constructor(private router: Router) {}

  public icon = 'assets/blue-checkmark.png';
  public plan = input.required<PricingPlan>();

  public onSelectPlan(): void {
    const planName = this.plan().name;
    let planId: number;

    switch (planName) {
      case 'Free Plan':
        planId = 1;
        break;
      case 'Pro':
        planId = 2;
        break;
      case 'Elite':
        planId = 3;
        break;
      default:
        planId = 1;
    }

    this.router.navigateByUrl(`${APP_CONSTANTS.FULL_PAGE_ROUTES.PLAN_CONFIRMATION}/${planId}`);
  }
}
