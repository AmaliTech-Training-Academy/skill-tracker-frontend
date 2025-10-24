import { ToastConfig, ToastType } from '@app/core';

export interface ToastState {
  isVisible: boolean;
  isExiting: boolean;
  config: ToastConfig | null;
}

export interface UIState {
  loading: boolean;
  sidebarOpen: boolean;
  toast: ToastState;
}

export const initialToastState: ToastState = {
  isVisible: false,
  isExiting: false,
  config: {
    type: ToastType.SUCCESS,
    title: '',
    message: '',
  },
};

export const initialUIState: UIState = {
  loading: false,
  sidebarOpen: false,
  toast: initialToastState,
};
