import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '@app/core';
import { ToastType } from '@app/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  private toastService = inject(ToastService);
  public toastType = ToastType;

  public config$ = this.toastService.config$;
  public show$ = this.toastService.isVisible$;
  public exiting$ = this.toastService.isExiting$;

  public onClose() {
    this.toastService.close();
  }
}
