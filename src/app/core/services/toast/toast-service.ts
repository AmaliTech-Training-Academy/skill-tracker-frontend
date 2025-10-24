import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastConfig, ToastType } from '../../models/toast-model';
import { showToast, startToastExit } from '@app/store';
import { selectIsToastVisible, selectIsToastExiting, selectToastConfig } from '@app/store';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private store = inject(Store);

  // Selectors for toast state
  readonly isVisible$ = this.store.select(selectIsToastVisible);
  readonly isExiting$ = this.store.select(selectIsToastExiting);
  readonly config$ = this.store.select(selectToastConfig);

  show(config: ToastConfig) {
    this.store.dispatch(showToast({ config }));
  }

  showSuccess(title: string, message: string) {
    this.show({ type: ToastType.SUCCESS, title, message });
  }

  showError(title: string, message: string) {
    this.show({ type: ToastType.ERROR, title, message });
  }

  showInfo(title: string, message: string) {
    this.show({ type: ToastType.INFO, title, message });
  }

  showWarning(title: string, message: string) {
    this.show({ type: ToastType.WARNING, title, message });
  }

  close() {
    this.store.dispatch(startToastExit());
  }
}
