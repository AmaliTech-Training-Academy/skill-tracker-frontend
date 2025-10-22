import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InterestsChipComponent } from '@app/shared/components/interests-chip/interests-chip';
import { SkillsService, Skill } from './interests.service';

@Component({
  selector: 'app-interests-selection',
  imports: [InterestsChipComponent],
  templateUrl: './interests-selection.html',
  styleUrl: './interests-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterestsSelection implements OnInit {
  selectedBadges: string[] = [];
  badges: Skill[] = [];

  constructor(private skillsService: SkillsService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  private loadSkills(): void {
    this.badges = this.skillsService.getSkills();
  }

  toggleBadge(id: string): void {
    if (this.selectedBadges.includes(id)) {
      this.selectedBadges = this.selectedBadges.filter((badge) => badge !== id);
    } else {
      this.selectedBadges = [...this.selectedBadges, id];
    }
  }
}
