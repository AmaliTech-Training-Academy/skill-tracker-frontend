import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ProgressBar, ProgressChart } from '@app/shared';
import { CustomDropdown } from '@app/shared/components/custom-dropdown/custom-dropdown';
import { AppError, SkillProgress } from '@app/core';
import { CapitalizePipe } from '@app/shared/pipes/capitalize.pipe';
import { ProgressBarSkeleton } from '../progress-bar-skeleton/progress-bar-skeleton';

@Component({
  selector: 'app-dashboard-progress-overview-component',
  imports: [ProgressBar, ProgressChart, CustomDropdown, CapitalizePipe, ProgressBarSkeleton],
  templateUrl: './dashboard-progress-overview-component.html',
  styleUrl: './dashboard-progress-overview-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProgressOverviewComponent {
  @Input({ required: true }) public primarySkillProgress: SkillProgress | null = null;
  @Input({ required: true }) public progressChartData: { label: string; value: number }[] = [];
  @Input({ required: true }) public isDashboardAnalyticsLoading: boolean = false;
  @Input({ required: true }) public isDashboardAnalyticsError: AppError | null = null;

  @Input({ required: true }) public selectedPeriod: string = 'weekly';
  @Output() public selectPeriod = new EventEmitter<string>();

  public data = {
    progressChartData: {
      weekly: [
        { label: 'Mon', value: 30 },
        { label: 'Tue', value: 10 },
        { label: 'Wed', value: 5 },
        { label: 'Thu', value: 0 },
        { label: 'Fri', value: 0 },
        { label: 'Sat', value: 0 },
        { label: 'Sun', value: 0 },
      ],
    },
  };

  public onSelectPeriod(period: string): void {
    this.selectPeriod.emit(period);
  }
}
