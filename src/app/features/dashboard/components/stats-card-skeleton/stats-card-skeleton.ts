import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-stats-card-skeleton',
  templateUrl: './stats-card-skeleton.html',
  styleUrl: './stats-card-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardSkeleton {
  @Input() public count = 3;

  protected skeletonItems = computed(() =>
    Array(this.count)
      .fill(0)
      .map((skeleton, index) => index),
  );
}
