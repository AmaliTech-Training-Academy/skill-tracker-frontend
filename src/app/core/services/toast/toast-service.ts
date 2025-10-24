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
  public readonly isVisible$ = this.store.select(selectIsToastVisible);
  public readonly isExiting$ = this.store.select(selectIsToastExiting);
  public readonly config$ = this.store.select(selectToastConfig);

  public show(config: ToastConfig) {
    this.store.dispatch(showToast({ config }));
  }

  public showSuccess(title: string, message: string) {
    this.show({ type: ToastType.SUCCESS, title, message });
  }

  public showError(title: string, message: string) {
    this.show({ type: ToastType.ERROR, title, message });
  }

  public showInfo(title: string, message: string) {
    this.show({ type: ToastType.INFO, title, message });
  }

  public showWarning(title: string, message: string) {
    this.show({ type: ToastType.WARNING, title, message });
  }

  public close() {
    this.store.dispatch(startToastExit());
  }
}
