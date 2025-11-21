import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppError, RecommendedTaskUI } from '@app/core';
import { CustomDropdown } from '@app/shared/components/custom-dropdown/custom-dropdown';
import { DashboardErrorComponent } from '../dashboard-error-component/dashboard-error-component';
import { RecommendedTasksCard } from '../recommended-tasks-card/recommended-tasks-card';
import { RecommendedTasksCardSkeleton } from '../recommended-tasks-card-skeleton/recommended-tasks-card-skeleton';

@Component({
  selector: 'app-dashboard-recommended-tasks',
  imports: [
    CustomDropdown,
    DashboardErrorComponent,
    RecommendedTasksCard,
    RecommendedTasksCardSkeleton,
  ],
  templateUrl: './dashboard-recommended-tasks.html',
  styleUrl: './dashboard-recommended-tasks.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardRecommendedTasks {
  @Input({ required: true }) public recommendations: RecommendedTaskUI[] = [];
  @Input() public isRecommendedTasksLoading = false;
  @Input() public recommendedTasksError: AppError | null = null;
}
