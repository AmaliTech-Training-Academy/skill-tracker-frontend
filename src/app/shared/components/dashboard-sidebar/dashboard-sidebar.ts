import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { logout } from '@app/store/auth/auth.actions';
import { selectIsLoggingOut } from '@app/store/auth/auth.selectors';
import { AppIcon } from '../app-icon/app-icon';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  tourId: string;
}

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, AppIcon],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebar {
  @Input({ required: true }) public isOpen!: boolean;
  @Input({ required: true }) public menuItems!: MenuItem[];
  @Input({ required: true }) public footerItems!: MenuItem[];

  @Output() public navigated = new EventEmitter<void>();

  public isSubmitting = this.store.selectSignal(selectIsLoggingOut);

  constructor(private store: Store<AppState>) {}

  public onNavigate(): void {
    this.navigated.emit();
  }

  public logout(): void {
    if (this.isSubmitting()) return;
    this.store.dispatch(logout());
  }

  public getRouterLinkOptions(route: string): { exact: boolean } {
    return { exact: route !== '/dashboard/tasks' };
  }
}
