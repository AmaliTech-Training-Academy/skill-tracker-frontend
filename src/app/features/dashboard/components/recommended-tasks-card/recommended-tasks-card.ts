import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RecommendedTaskUI } from '@app/core';

@Component({
  selector: 'app-recommended-tasks-card',
  imports: [NgClass],
  templateUrl: './recommended-tasks-card.html',
  styleUrl: './recommended-tasks-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedTasksCard {
  public task = input.required<RecommendedTaskUI>();
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
