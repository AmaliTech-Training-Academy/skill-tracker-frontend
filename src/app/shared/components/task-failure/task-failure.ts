import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-task-failure',
  templateUrl: './task-failure.html',
  styleUrl: './task-failure.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFailure {
  public errorMessage = input.required<string>();
  public tryAgain = output<void>();
  public backToDashboard = output<void>();
}
