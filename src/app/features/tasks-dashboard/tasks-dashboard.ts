import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TaskHeader } from './components/task-header/task-header';
import {
  selectFilteredTodayTasks,
  selectSkillFilter,
  selectFilteredPreviousTasks,
  selectTimeRangeFilter,
  selectTasksLoading,
  selectPendingTasksPagination,
  selectCompletedTasksPagination,
} from '@app/store/tasks/tasks.selectors';
import {
  changeSkillFilter,
  changeTimeRangeFilter,
  loadTasks,
  loadUserSkills,
  startTask,
  changeTodayTasksPage,
  changePreviousTasksPage,
} from '@app/store/tasks/tasks.actions';
import { TaskList } from './components/task-list/task-list';
import {
  completedPeriodToString,
  stringToCompletedPeriod,
} from '@app/shared/utils/completed-period.util';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.html',
  styleUrl: './tasks-dashboard.scss',
  imports: [TaskHeader, TaskList],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDashboard implements OnInit {
  constructor(private store: Store) {}

  public todayTasks = this.store.selectSignal(selectFilteredTodayTasks);
  public previousTasks = this.store.selectSignal(selectFilteredPreviousTasks);
  public todayTasksPagination = this.store.selectSignal(selectPendingTasksPagination);
  public previousTasksPagination = this.store.selectSignal(selectCompletedTasksPagination);

  public selectedSkill = this.store.selectSignal(selectSkillFilter);
  public selectedTimeRange = this.store.selectSignal(selectTimeRangeFilter);
  public loading = this.store.selectSignal(selectTasksLoading);

  public get selectedTimeRangeString(): string {
    return completedPeriodToString(this.selectedTimeRange());
  }

  public ngOnInit(): void {
    this.store.dispatch(loadTasks());
    this.store.dispatch(loadUserSkills());
  }

  public onSkillChange(skill: string): void {
    this.store.dispatch(changeSkillFilter({ skill }));
  }

  public onTimeRangeChanged(timeRange: string): void {
    const period = stringToCompletedPeriod(timeRange);
    this.store.dispatch(changeTimeRangeFilter({ period }));
  }

  public onStartTask(taskId: string): void {
    const task = [...this.todayTasks()].find((t) => t.id === taskId);
    if (task) {
      this.store.dispatch(startTask({ taskId, taskType: task.type }));
    }
  }

  public onTodayPageChange(page: number): void {
    this.store.dispatch(changeTodayTasksPage({ page }));
  }

  public onPreviousPageChange(page: number): void {
    this.store.dispatch(changePreviousTasksPage({ page }));
  }
}
