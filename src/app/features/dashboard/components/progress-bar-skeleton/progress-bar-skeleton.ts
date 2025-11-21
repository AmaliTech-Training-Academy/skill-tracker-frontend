import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-progress-bar-skeleton',
  templateUrl: './progress-bar-skeleton.html',
  styleUrl: './progress-bar-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarSkeleton {}
