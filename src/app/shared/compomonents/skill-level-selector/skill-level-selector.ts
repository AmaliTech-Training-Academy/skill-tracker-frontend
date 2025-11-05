import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillLevel } from '@app/core';
@Component({
  selector: 'app-skill-level-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-level-selector.html',
  styleUrl: './skill-level-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillLevelSelectorComponent {
  @Input({ required: true }) public skillName = '';
  @Input() public skillIcon = '';
  @Input() public selectedLevel: SkillLevel = null;
  @Input() public levels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
  @Output() public levelSelected = new EventEmitter<SkillLevel>();

  public onLevelSelect(level: SkillLevel): void {
    this.levelSelected.emit(level);
  }
}
