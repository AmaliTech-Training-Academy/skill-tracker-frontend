import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.html',
  imports: [RouterOutlet],
  styleUrl: './tasks-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDashboard {}
