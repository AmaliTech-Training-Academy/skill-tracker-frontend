import { Component, input, output, computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TaskUI, PagedResponse } from '@app/core/models/tasks-model';
import { TasksCard } from '../tasks-card/tasks-card';
import { TaskCardSkeleton } from '../task-card-skeleton/task-card-skeleton';
import { CustomDropdown } from '@app/shared/components/custom-dropdown/custom-dropdown';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { selectTimeRanges } from '@app/store/tasks/tasks.selectors';
import { Store } from '@ngrx/store';

type ViewState = 'loading' | 'empty' | 'data';

interface TaskSection {
  title: string;
  tasks: TaskUI[];
  emptyMessage: string;
  showDropdown?: boolean;
  viewState: ViewState;
}

@Component({
  selector: 'app-task-list',
  imports: [TasksCard, TaskCardSkeleton, CustomDropdown, Pagination],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskList {
  constructor(private store: Store) {}

  public todayTasks = input.required<TaskUI[]>();
  public previousTasks = input.required<TaskUI[]>();
  public todayTasksPagination = input.required<PagedResponse<TaskUI>>();
  public previousTasksPagination = input.required<PagedResponse<TaskUI>>();
  public selectedTimeRange = input<string | undefined>();
  public loading = input<boolean>(false);

  public timeRangeChanged = output<string>();
  public startTask = output<string>();
  public todayPageChanged = output<number>();
  public previousPageChanged = output<number>();

  public timeRanges = this.store.selectSignal(selectTimeRanges);
  public skeletonItems = Array.from({ length: 3 });

  public taskSections = computed<TaskSection[]>(() => {
    const getViewState = (tasks: TaskUI[]): ViewState => {
      if (this.loading()) return 'loading';
      return tasks.length ? 'data' : 'empty';
    };

    return [
      {
        title: "Today's Tasks",
        tasks: this.todayTasks(),
        emptyMessage: 'No tasks scheduled for today.',
        viewState: getViewState(this.todayTasks()),
      },
      {
        title: 'Previous Tasks',
        tasks: this.previousTasks(),
        emptyMessage: 'No tasks found for the selected time period.',
        showDropdown: true,
        viewState: getViewState(this.previousTasks()),
      },
    ];
  });

  public onTimeRangeChange(timeRange: string): void {
    this.timeRangeChanged.emit(timeRange);
  }

  public onStartTask(taskId: string): void {
    this.startTask.emit(taskId);
  }

  public onTodayPageChange(page: number): void {
    this.todayPageChanged.emit(page);
  }

  public onPreviousPageChange(page: number): void {
    this.previousPageChanged.emit(page);
  }
}
