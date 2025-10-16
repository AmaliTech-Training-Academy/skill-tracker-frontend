import { Injectable, signal } from '@angular/core';
import { ToastConfig, ToastType } from '../../models/toast-model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  showToast = signal(false);
  toastExiting = signal(false);
  toastConfig = signal<ToastConfig>({
    type: ToastType.SUCCESS,
    title: '',
    message: '',
  });

  showSuccess(title: string, message: string) {
    this.toastConfig.set({ type: ToastType.SUCCESS, title, message });
    this.displayToast();
  }

  showError(title: string, message: string) {
    this.toastConfig.set({ type: ToastType.ERROR, title, message });
    this.displayToast();
  }

  showInfo(title: string, message: string) {
    this.toastConfig.set({ type: ToastType.INFO, title, message });
    this.displayToast();
  }

  showWarning(title: string, message: string) {
    this.toastConfig.set({ type: ToastType.WARNING, title, message });
    this.displayToast();
  }

  private displayToast() {
    this.showToast.set(true);
    setTimeout(() => {
      this.toastExiting.set(true);
      setTimeout(() => {
        this.showToast.set(false);
        this.toastExiting.set(false);
      }, 300);
    }, 4000);
  }

  closeToast() {
    this.toastExiting.set(true);
    setTimeout(() => {
      this.showToast.set(false);
      this.toastExiting.set(false);
    }, 300);
  }
}
