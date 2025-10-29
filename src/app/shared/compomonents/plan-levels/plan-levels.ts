import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-plan-levels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-levels.html',
  styleUrl: './plan-levels.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanLevels {
  @Input() currentStep: number = 1; 
}
