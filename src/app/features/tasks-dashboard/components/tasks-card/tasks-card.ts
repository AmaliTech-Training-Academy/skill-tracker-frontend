import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskUI } from '@app/core/models/tasks-model';
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
  public startTask = output<string>();

  public onStartTask(): void {
    this.startTask.emit(this.task().id);
  }

  public getIconClass(icon: string): Record<string, boolean> {
    const classMap: Record<string, string> = {
      abc: 'icon-abc',
      pencil: 'icon-pencil',
    };

    const className = classMap[icon] || 'icon-abc';

    return {
      [className]: true,
    };
  }

  public getIconPath(icon: string): string {
    const iconMap: Record<string, string> = {
      abc: 'assets/abc.png',
      pencil: 'assets/pencil.png',
    };
    return iconMap[icon] || 'assets/abc.png';
  }
}
