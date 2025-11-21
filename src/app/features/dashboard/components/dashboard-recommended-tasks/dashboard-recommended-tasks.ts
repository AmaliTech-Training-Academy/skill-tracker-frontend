import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppError, RecommendedTaskUI, UserSelectedSkill } from '@app/core';
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
  @Input() public userSkills: UserSelectedSkill[] = [];
  @Input() public selectedSkill: string | null = null;
  @Output() public selectSkill = new EventEmitter<string>();
  @Output() public retry = new EventEmitter<void>();

  public get skillOptions(): string[] {
    return this.userSkills.map((skill) => skill.skillName);
  }

  public get selectedSkillName(): string {
    const skill = this.userSkills.find((s) => s.skillId === this.selectedSkill);
    return skill?.skillName || '';
  }

  public onSelectSkill(skillName: string): void {
    const skill = this.userSkills.find((s) => s.skillName === skillName);
    if (skill) {
      this.selectSkill.emit(skill.skillId);
    }
  }

  public handleRetryClick() {
    this.retry.emit();
  }
}
