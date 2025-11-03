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
  @Input() public label = '';
  @Input() public icon = '';
  @Input() public selected = false;

  @Output() public chipSelect = new EventEmitter<void>();

  public onSelect(): void {
    this.chipSelect.emit();
  }
}
