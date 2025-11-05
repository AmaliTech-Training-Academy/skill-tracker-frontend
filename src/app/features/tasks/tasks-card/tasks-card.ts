import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Task } from '@app/core/models/tasks-model';

@Component({
  selector: 'app-tasks-card',
  templateUrl: './tasks-card.html',
  styleUrl: './tasks-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksCard {
  public task = input.required<Task>();
  public startTask = output<string>();

  public onStartTask(): void {
    this.startTask.emit(this.task().id);
  }

  public getIconPath(icon: string): string {
    const iconMap: Record<string, string> = {
      abc: 'assets/abc.png',
      pencil: 'assets/pencil.png',
    };
    return iconMap[icon] || 'assets/abc.png';
  }
}
