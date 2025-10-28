import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FeatureCard {
  public title = input.required<string>();
  public description = input.required<string>();
  public icon = input.required<string>();
}
