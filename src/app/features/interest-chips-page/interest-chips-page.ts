import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterestsChipComponent } from '@app/shared/compomonents/interests-chip/interests-chip';
import { SkillLevelSelectorComponent } from '@app/shared/compomonents/skill-level-selector/skill-level-selector';

@Component({
  selector: 'app-interests-page',
  imports: [CommonModule, InterestsChipComponent, SkillLevelSelectorComponent],
  templateUrl: './interest-chips-page.html',
  styleUrl: './interest-chips-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestsPageComponent {
  public selectedBadges: string[] = [];

  public badges = [
    { id: 'htmlcss', label: 'HTML & CSS (Web Basics)', icon: 'assets/htmlcss-icon.png' },
    { id: 'javascript', label: 'JavaScript', icon: 'assets/js-icon.png' },
    { id: 'angular', label: 'Angular', icon: 'assets/angular-icon.png' },
  ];

  public selectedLevel = '';

  public toggleBadge(id: string): void {
    if (this.selectedBadges.includes(id)) {
      this.selectedBadges = this.selectedBadges.filter((badge) => badge !== id);
    } else {
      this.selectedBadges = [...this.selectedBadges, id];
    }
  }

  public onLevelSelected(level: string): void {
    this.selectedLevel = level;
  }
}
