import { Component, ChangeDetectionStrategy, input, output, computed, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task, TaskType, CodingTaskContent } from '@app/core/models/tasks-model';
import { selectTimerDisplay, selectIsTimerRunning } from '@app/store/tasks/tasks.selectors';
import * as TasksActions from '@app/store/tasks/tasks.actions';

const DESKTOP_BREAKPOINT = 768;
const DEFAULT_TIME_DISPLAY = '00:00';
const TIME_PADDING = 2;
const TIME_PAD_CHAR = '0';

@Component({
  selector: 'app-challenge-description',
  templateUrl: './challenge-description.html',
  styleUrl: './challenge-description.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChallengeDescription {
  constructor(private store: Store) {}

  public readonly task = input.required<Task | null>();
  public readonly startTask = output<void>();
  public readonly timerDisplay = this.store.selectSignal(selectTimerDisplay);
  public readonly isTimerRunning = this.store.selectSignal(selectIsTimerRunning);

  public readonly codingContent = computed(() => {
    const task = this.task();
    return task?.type === TaskType.CODING ? (task.content as CodingTaskContent) : null;
  });

  public readonly displayTime = computed(() => {
    const task = this.task();
    const isRunning = this.isTimerRunning();

    if (isRunning) {
      return this.timerDisplay();
    }

    if (task) {
      const minutes = task.estimatedDuration;
      return `${minutes.toString().padStart(TIME_PADDING, TIME_PAD_CHAR)}:00`;
    }

    return DEFAULT_TIME_DISPLAY;
  });

  private autoStartDesktopTimer = effect(() => {
    const task = this.task();
    const isRunning = this.isTimerRunning();

    if (task && !isRunning && window.innerWidth >= DESKTOP_BREAKPOINT) {
      this.store.dispatch(TasksActions.startTimer({ durationMinutes: task.estimatedDuration }));
    }
  });

  public onStartClick(): void {
    this.startTask.emit();
  }
}
