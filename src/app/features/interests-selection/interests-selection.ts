import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InterestsChipComponent } from '@app/shared/compomonents/interests-chip/interests-chip';
import { SkillsService, Skill } from './interests.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-interests-selection',
  imports: [InterestsChipComponent, RouterLink],
  templateUrl: './interests-selection.html',
  styleUrl: './interests-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestsSelection implements OnInit {
  public selectedBadges: string[] = [];
  public badges: Skill[] = [];

  constructor(private skillsService: SkillsService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  private loadSkills(): void {
    this.badges = this.skillsService.getSkills();
  }

  public toggleBadge(id: string): void {
    if (this.selectedBadges.includes(id)) {
      this.selectedBadges = this.selectedBadges.filter((badge) => badge !== id);
    } else {
      this.selectedBadges = [...this.selectedBadges, id];
    }
  }
}
