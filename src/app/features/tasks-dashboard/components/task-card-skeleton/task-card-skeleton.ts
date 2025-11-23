import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-task-card-skeleton',
  templateUrl: './task-card-skeleton.html',
  styleUrl: './task-card-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardSkeleton {}
