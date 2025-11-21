import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-task-complete',
  imports: [],
  templateUrl: './task-complete.html',
  styleUrl: './task-complete.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComplete {
  public xpEarned = input.required<number>();

  public continue = output<void>();
}
