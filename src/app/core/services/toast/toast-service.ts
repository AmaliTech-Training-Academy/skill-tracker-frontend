import { Injectable, signal } from '@angular/core';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastConfig, ToastType } from '../../models/toast-model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly TOAST_DISPLAY_DURATION = 4000;
  private readonly TOAST_EXIT_ANIMATION_DURATION = 300;
  private destroy$ = new Subject<void>();

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

    timer(this.TOAST_DISPLAY_DURATION)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.startExitAnimation();
      });
  }

  private startExitAnimation() {
    this.toastExiting.set(true);

    timer(this.TOAST_EXIT_ANIMATION_DURATION)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.hideToast();
      });
  }

  private hideToast() {
    this.showToast.set(false);
    this.toastExiting.set(false);
  }

  closeToast() {
    this.startExitAnimation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
