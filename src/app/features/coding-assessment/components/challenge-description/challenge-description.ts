import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CodingTask } from '@app/core/models/tasks-model';

@Component({
  selector: 'app-challenge-description',
  templateUrl: './challenge-description.html',
  styleUrl: './challenge-description.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChallengeDescription {
  public readonly task = input.required<CodingTask>();
  public readonly startTask = output<void>();

  public readonly estimatedTime = computed(() => {
    const minutes = this.task().estimatedDuration;
    return `${minutes.toString().padStart(2, '0')}:00`;
  });

  public onStartClick(): void {
    this.startTask.emit();
  }
}
