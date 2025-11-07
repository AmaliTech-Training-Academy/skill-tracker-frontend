import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.html',
  styleUrl: './tasks-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDashboard {}
