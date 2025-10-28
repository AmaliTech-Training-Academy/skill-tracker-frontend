import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FeatureCard } from '@app/features/landing-page/components/feature-card/feature-card';
import { Feature } from '@app/core/models/feature-card-model';

@Component({
  selector: 'app-feature-section',
  imports: [FeatureCard],
  templateUrl: './feature-section.html',
  styleUrl: './feature-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection {
  public title = input.required<string>();
  public subtitle = input.required<string>();
  public items = input.required<Feature[]>();
  public type = input<'default' | 'skill-development'>('default');
}