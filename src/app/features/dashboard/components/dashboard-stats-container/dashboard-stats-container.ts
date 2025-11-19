import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { UserStats } from '@app/core';
import { StatCard } from '@app/shared';

@Component({
  selector: 'app-dashboard-stats-container',
  imports: [StatCard],
  templateUrl: './dashboard-stats-container.html',
  styleUrl: './dashboard-stats-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatsContainer {
  @Input({ required: true }) public userStats: UserStats | null = null;
  @Input({ required: true }) public skillsInProgressCount: number = 0;
}
