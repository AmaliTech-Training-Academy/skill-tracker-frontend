import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavigation } from '../../shared/dashboard-navigation/dashboard-navigation';
import { DashboardSidebar } from '../../shared/dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, DashboardNavigation, DashboardSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
