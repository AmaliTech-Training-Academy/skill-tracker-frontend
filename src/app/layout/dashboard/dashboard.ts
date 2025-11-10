import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DashboardNavigation, DashboardSidebar } from '@app/shared/';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, DashboardNavigation, DashboardSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}

  public isSidebarOpen = signal(false);

  public menuItems = [
    {
      icon: 'house',
      label: 'Dashboard',
      route: '/dashboard',
      tourId: 'sidebar-dashboard',
    },
    { icon: 'compass', label: 'Tasks', route: '/dashboard/tasks', tourId: 'sidebar-tasks' },
    {
      icon: 'chart-line',
      label: 'Leaderboard',
      route: '/dashboard/leaderboard',
      tourId: 'sidebar-leaderboard',
    },
    {
      icon: 'zap',
      label: 'Skill Arena',
      route: '/dashboard/skill-arena',
      tourId: 'sidebar-skill-arena',
    },
    {
      icon: 'star',
      label: 'Badges',
      route: '/dashboard/achievements',
      tourId: 'sidebar-achievements',
    },
    {
      icon: 'users',
      label: 'Groups',
      route: '/dashboard/groups',
      tourId: 'sidebar-groups',
    },
  ];
  public footerItems = [
    { icon: 'settings', label: 'Settings', route: '/settings', tourId: 'sidebar-settings' },
  ];

  public ngOnInit(): void {
    this.setDashboardMetaTags();
  }

  private setDashboardMetaTags() {
    this.title.setTitle('SkillDev - Dashboard');
    this.meta.addTag({
      name: 'description',
      content: 'Your SkillDev dashboard to track progress.',
    });
    this.meta.addTag({ name: 'keywords', content: 'dashboard, skills, tracking, development' });
  }

  public onNavigate() {
    this.isSidebarOpen.set(false);
  }

  public toggleSidebar() {
    this.isSidebarOpen.update((current) => !current);
  }
}
