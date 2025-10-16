import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastConfig, ToastType } from 'src/app/core/models/toast-model';
import { ToastService } from 'src/app/core/services/toast/toast-service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
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
