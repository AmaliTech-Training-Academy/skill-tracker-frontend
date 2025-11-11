import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TaskHeader } from './components/task-header/task-header';
import {
  selectFilteredTodayTasks,
  selectSkillFilter,
  selectFilteredPreviousTasks,
  selectTimeRangeFilter,
} from '@app/store/tasks/tasks.selectors';
import {
  changeSkillFilter,
  changeTimeRangeFilter,
  loadTasks,
  startTask,
} from '@app/store/tasks/tasks.actions';
import { TaskList } from './components/task-list/task-list';

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
  public selectedSkill = this.store.selectSignal(selectSkillFilter);
  public selectedTimeRange = this.store.selectSignal(selectTimeRangeFilter);

  public ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }

  public onSkillChange(skill: string): void {
    this.store.dispatch(changeSkillFilter({ skill }));
  }

  public onTimeRangeChanged(timeRange: string): void {
    this.store.dispatch(changeTimeRangeFilter({ timeRange }));
  }

  public onStartTask(taskId: string): void {
    this.store.dispatch(startTask({ taskId }));
  }
}
