import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { selectTotalUserXp } from '@app/store/tasks';
import { AppState } from '@app/store';

@Component({
  selector: 'app-dashboard-navigation',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './dashboard-navigation.html',
  styleUrl: './dashboard-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavigation {
  @Output() public toggleSidebar = new EventEmitter<void>();
  @Input({ required: true }) public isSidebarOpen!: boolean;
  public user = this.store.selectSignal(selectCurrentUser);
  public totalUserxp = this.store.selectSignal(selectTotalUserXp);

  constructor(private store: Store<AppState>) {}
  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
