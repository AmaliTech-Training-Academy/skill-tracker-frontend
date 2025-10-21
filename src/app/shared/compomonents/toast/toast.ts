import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastType } from '@app/core';
import { ToastService } from '@app/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  private toastService = inject(ToastService);

  ToastType = ToastType;

  get config() {
    return this.toastService.config();
  }

  get show() {
    return this.toastService.isVisible();
  }

  get exiting() {
    return this.toastService.isExiting();
  }

  onClose() {
    this.toastService.close();
  }
}
