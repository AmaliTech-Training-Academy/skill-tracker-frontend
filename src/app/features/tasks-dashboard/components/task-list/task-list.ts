import { Component, input, output } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Task } from '@app/core/models/tasks-model';
import { TasksCard } from '../tasks-card/tasks-card';
import { CustomDropdown } from '@app/shared/components/custom-dropdown/custom-dropdown';
import { selectTimeRanges } from '@app/store/tasks/tasks.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-task-list',
  imports: [TasksCard, CustomDropdown],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskList {
  constructor(private store: Store) {}

  public todayTasks = input.required<Task[]>();
  public previousTasks = input.required<Task[]>();
  public selectedTimeRange = input<string | undefined>();

  public timeRangeChanged = output<string>();
  public startTask = output<string>();

  public timeRanges = this.store.selectSignal(selectTimeRanges);

  public onTimeRangeChange(timeRange: string): void {
    this.timeRangeChanged.emit(timeRange);
  }

  public onStartTask(taskId: string): void {
    this.startTask.emit(taskId);
  }
}
