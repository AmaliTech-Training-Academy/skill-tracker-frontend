import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-navigation',
  imports: [LucideAngularModule],
  templateUrl: './dashboard-navigation.html',
  styleUrl: './dashboard-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavigation {
  @Output() public toggleSidebar = new EventEmitter<void>();
  @Input({ required: true }) public isSidebarOpen!: boolean;

  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
