import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  imports: [LucideAngularModule],
  templateUrl: './app-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIcon {
  @Input({ required: true }) public name!: string;
  @Input() public size: number = 24;
  @Input() public color: string = 'currentColor';
  @Input() public strokeWidth: number = 1.5;
}
