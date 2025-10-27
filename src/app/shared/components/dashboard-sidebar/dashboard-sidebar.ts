import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  tourId: string;
}

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebar {
  @Input({ required: true }) public isOpen!: boolean;
  @Input({ required: true }) public menuItems!: MenuItem[];
  @Input({ required: true }) public footerItems!: MenuItem[];

  @Output() public navigated = new EventEmitter<void>();

  public onNavigate(): void {
    this.navigated.emit();
  }
}
