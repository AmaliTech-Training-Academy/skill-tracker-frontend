import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interests-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interests-chip.html',
  styleUrl: './interests-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestsChipComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() selected = false;

  @Output() chipSelect = new EventEmitter<void>();

  onClick(): void {
    this.chipSelect.emit();
  }
}
