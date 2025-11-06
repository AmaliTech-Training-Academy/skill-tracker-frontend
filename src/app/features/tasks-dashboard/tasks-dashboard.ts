import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TasksCard } from './components/tasks-card/tasks-card';
import { TaskHeader } from './components/task-header/task-header';
import { selectFilteredTodayTasks, selectSkillFilter } from '@app/store/tasks/tasks.selectors';
import { changeSkillFilter } from '@app/store/tasks/tasks.actions';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.html',
  styleUrl: './tasks-dashboard.scss',
  imports: [TasksCard, TaskHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {
  constructor(private store: Store) {}

  public todayTasks = this.store.selectSignal(selectFilteredTodayTasks);
  public selectedSkill = this.store.selectSignal(selectSkillFilter);

  public onSkillChange(skill: string): void {
    this.store.dispatch(changeSkillFilter({ skill }));
  }
}
