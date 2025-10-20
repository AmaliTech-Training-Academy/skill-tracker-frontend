import { Injectable, OnDestroy, signal } from '@angular/core';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastConfig, ToastType } from '../../models/toast-model';

@Injectable({
  providedIn: 'root',
})
export class ToastService implements OnDestroy {
  private readonly DEFAULT_DURATION = 4000;
  private readonly EXIT_ANIMATION_DURATION = 300;
  private destroy$ = new Subject<void>();

  // Global toast state
  isVisible = signal(false);
  isExiting = signal(false);
  config = signal<ToastConfig>({
    type: ToastType.SUCCESS,
    title: '',
    message: '',
  });

  show(config: ToastConfig, duration: number = this.DEFAULT_DURATION) {
    this.config.set(config);
    this.isVisible.set(true);
    this.isExiting.set(false);

    timer(duration)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.startExitAnimation();
      });
  }

  showSuccess(title: string, message: string, duration?: number) {
    this.show({ type: ToastType.SUCCESS, title, message }, duration);
  }

  showError(title: string, message: string, duration?: number) {
    this.show({ type: ToastType.ERROR, title, message }, duration);
  }

  showInfo(title: string, message: string, duration?: number) {
    this.show({ type: ToastType.INFO, title, message }, duration);
  }

  showWarning(title: string, message: string, duration?: number) {
    this.show({ type: ToastType.WARNING, title, message }, duration);
  }

  close() {
    this.startExitAnimation();
  }

  private startExitAnimation() {
    this.isExiting.set(true);

    timer(this.EXIT_ANIMATION_DURATION)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isVisible.set(false);
        this.isExiting.set(false);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
