import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskUI, TaskType } from '@app/core/models/tasks-model';
import { CapitalizePipe } from '@app/shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-tasks-card',
  templateUrl: './tasks-card.html',
  styleUrl: './tasks-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, CapitalizePipe],
  standalone: true,
})
export class TasksCard {
  public task = input.required<TaskUI>();
  public isCompleted = input<boolean>(false);
  public startTask = output<string>();

  private taskTypeIconMap = {
    [TaskType.ESSAY]: { class: 'icon-pencil', path: 'assets/pencil.png' },
    [TaskType.MULTIPLE_CHOICE]: { class: 'icon-abc', path: 'assets/abc.png' },
    [TaskType.CODING]: { class: 'icon-code', path: 'assets/code-task.png' },
  };

  public iconClass = computed(() => {
    const iconData = this.taskTypeIconMap[this.task().type];
    return { [iconData.class]: true };
  });

  public iconPath = computed(() => {
    return this.taskTypeIconMap[this.task().type].path;
  });

  public onStartTask(): void {
    this.startTask.emit(this.task().id);
  }
}
