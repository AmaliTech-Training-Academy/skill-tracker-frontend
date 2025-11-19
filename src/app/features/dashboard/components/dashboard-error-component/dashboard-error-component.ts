import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppIcon } from '@app/shared/components/app-icon/app-icon';

@Component({
  selector: 'app-dashboard-error-component',
  imports: [AppIcon],
  templateUrl: './dashboard-error-component.html',
  styleUrl: './dashboard-error-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardErrorComponent {
  @Input() public title: string = 'An Error Occurred';
  @Input() public message: string = 'Please try again later';
  @Output() public retry = new EventEmitter<void>();

  public onRetryClick(): void {
    this.retry.emit();
  }
}
