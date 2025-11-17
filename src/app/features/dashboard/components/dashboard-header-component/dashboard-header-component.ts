import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-header-component',
  templateUrl: './dashboard-header-component.html',
  styleUrl: './dashboard-header-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent {
  @Input({ required: true }) public username: string | null = '';

  public get welcomeMessage(): string {
    return `Welcome ${this.username} 👋`;
  }
}
