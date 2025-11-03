import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingCard {
  public icon = 'assets/blue-checkmark.png'
  public plan = input.required<PricingPlan>();
}
