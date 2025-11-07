import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSkills } from '@app/store/tasks/tasks.selectors';
import { CustomDropdown } from '@app/shared/components/custom-dropdown/custom-dropdown';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.html',
  styleUrl: './task-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomDropdown],
})
export class TaskHeader {
  constructor(private store: Store) {}
  public title = 'Tasks';
  public subtitle = 'Complete task to improve your skills';

  public selectedSkill = input<string>();
  public skillChanged = output<string>();
  public skills = this.store.selectSignal(selectSkills);

  public onSkillChange(skill: string): void {
    this.skillChanged.emit(skill);
  }
}
