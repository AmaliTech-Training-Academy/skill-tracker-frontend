export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface ToastConfig {
  type: ToastType;
  title: string;
  message: string;
}
