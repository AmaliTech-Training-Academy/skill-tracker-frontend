import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterestsChipComponent } from '@app/shared/components/interests-chip/interests-chip';
import { SkillLevelSelectorComponent } from '@app/shared/components/skill-level-selector/skill-level-selector';

@Component({
  selector: 'app-interests-page',
  standalone: true,
  imports: [CommonModule, InterestsChipComponent, SkillLevelSelectorComponent],
  templateUrl: './interest-chips-page.html',
  styleUrl: './interest-chips-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestsPageComponent {
  selectedBadges: string[] = [];

  badges = [
    { id: 'htmlcss', label: 'HTML & CSS (Web Basics)', icon: 'assets/htmlcss-icon.png' },
    { id: 'javascript', label: 'JavaScript', icon: 'assets/js-icon.png' },
    { id: 'angular', label: 'Angular', icon: 'assets/angular-icon.png' },
  ];

  selectedLevel = '';

  toggleBadge(id: string): void {
    if (this.selectedBadges.includes(id)) {
      this.selectedBadges = this.selectedBadges.filter((badge) => badge !== id);
    } else {
      this.selectedBadges = [...this.selectedBadges, id];
    }
  }

  onLevelSelected(level: string): void {
    this.selectedLevel = level;
  }
}
