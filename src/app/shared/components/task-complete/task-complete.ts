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
  public title = input<string>('Task Complete!');
  public message = input<string>();
  public buttonText = input<string>('Continue');
  public robotImage = 'assets/happy-robot.png';
  public robotAlt = input<string>('Success Robot');
  public showLoadingSpinner = input<boolean>(false);

  public continue = output<void>();
  public secondary = output<void>();
  public showSecondaryButton = input<boolean>(false);
  public secondaryButtonText = input<string>('Back to Dashboard');

  public getDefaultMessage(): string {
    return (
      this.message() ||
      `You've earned +${this.xpEarned()} for finishing your task.
      Keep it up—every step brings you closer to your goals!`
    );
  }

  public getTitleWithDots(): string {
    return this.title();
  }
}
