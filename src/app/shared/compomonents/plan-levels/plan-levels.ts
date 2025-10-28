import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-levels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-levels.html',
  styleUrls: ['./plan-levels.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanLevels implements OnChanges {
  @Input() currentStep: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStep']) {
      console.log('Current step changed:', this.currentStep);
    }
  }

  isActive(step: number): boolean {
    return step === this.currentStep;
  }
}
