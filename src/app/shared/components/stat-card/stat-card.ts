import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { AppIcon } from '../app-icon/app-icon';
@Component({
  selector: 'app-stat-card',
  imports: [LucideAngularModule, AppIcon],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  @Input() public title: string = '';
  @Input() public value: string | number = '';
  @Input() public iconName: string = '';
  @Input() public iconSize: number = 24;
}
