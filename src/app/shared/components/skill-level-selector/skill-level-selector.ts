import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-level-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-level-selector.html',
  styleUrl: './skill-level-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillLevelSelectorComponent {
  @Input() skillLabel = '';
  @Input() skillIcon = '';
  @Output() levelSelected = new EventEmitter<string>();

  selectedLevel: string | null = null;

  levels = [
    { name: 'Beginner', color: '#358439', BackgroundColor: '#F3FAF3', selectedBg: '#358439' },
    { name: 'Intermediate', color: '#142FE1', BackgroundColor: '#EEF4FF', selectedBg: '#142FE1' },
    { name: 'Advanced', color: '#DD7602', BackgroundColor: '#FFFBEB', selectedBg: '#DD7602' },
  ];

  selectLevel(level: string): void {
    this.selectedLevel = level;
    this.levelSelected.emit(level);
  }
}