import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ProgressBar, ProgressChart } from '@app/shared';
import { CustomDropdown } from '@app/shared/components/custom-dropdown/custom-dropdown';
import { AppError, SkillProgress, UserSelectedSkill } from '@app/core';
import { CapitalizePipe } from '@app/shared/pipes/capitalize.pipe';
import { ProgressBarSkeleton } from '../progress-bar-skeleton/progress-bar-skeleton';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-dashboard-progress-overview-component',
  imports: [
    ProgressBar,
    ProgressChart,
    CustomDropdown,
    CapitalizePipe,
    ProgressBarSkeleton,
    FormsModule,
  ],
  templateUrl: './dashboard-progress-overview-component.html',
  styleUrl: './dashboard-progress-overview-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProgressOverviewComponent {
  @Input({ required: true }) public primarySkillProgress: SkillProgress | null = null;
  @Input({ required: true }) public progressChartData: { label: string; value: number }[] = [];
  @Input({ required: true }) public isDashboardAnalyticsLoading: boolean = false;
  @Input({ required: true }) public isDashboardAnalyticsError: AppError | null = null;
  @Input() public isUserSkillsLoading: boolean = false;

  @Input({ required: true }) public selectedPeriod: string = 'weekly';
  @Output() public selectPeriod = new EventEmitter<string>();
  @Output() public selectSkill = new EventEmitter<string>();
  @Input() public selectedSkill: string | null = null;
  @Input() public userSkills: UserSelectedSkill[] = [];

  public get skillOptions(): string[] {
    return this.userSkills.map((skill) => skill.skillName);
  }

  public get selectedSkillName(): string {
    const skill = this.userSkills.find((skill) => skill.skillId === this.selectedSkill);
    return skill?.skillName || '';
  }

  public onSelectPeriod(period: string): void {
    this.selectPeriod.emit(period);
  }

  public onSelectSkill(skillId: string): void {
    const skill = this.userSkills.find((skill) => skill.skillId === skillId);
    if (skill) {
      this.selectSkill.emit(skill.skillId);
    }
  }
}
