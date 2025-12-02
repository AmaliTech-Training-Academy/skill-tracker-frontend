import { ChangeDetectionStrategy, Component, computed, Input, Signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  imports: [DecimalPipe],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
  @Input() public currentXp: number = 0;
  @Input() public totalXp: number = 100;
  @Input() public levelName: string = 'Next Level';

  public progressPercent: Signal<number> = computed(() => {
    if (this.totalXp === 0) return 0;
    return (this.currentXp / (this.currentXp + this.totalXp)) * 100;
  });
}
