import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppError, ValidationDetail, AppErrorType } from '../../models/app-error.model';
import { ToastService } from '../toast/toast-service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private toast: ToastService) {}

  getError(error: unknown): AppError {
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        return {
          message: 'No internet connection. Please check your network settings.',
          type: AppErrorType.NETWORK,
          raw: error,
        };
      }

      const backendMessage =
        error.error?.message ||
        error.error?.error ||
        (typeof error.error === 'string' ? error.error : null);

      const rawValidationErrors = error.error?.errors;
      let validationErrors: ValidationDetail[] | undefined;

      if (Array.isArray(rawValidationErrors)) {
        validationErrors = rawValidationErrors.map((err) => ({
          field: err.field || 'general',
          message: err.message || 'Validation failed for a field.',
        }));
      }

      switch (error.status) {
        case 400:
          return {
            message: backendMessage || 'Bad request. Please check your input.',
            status: error.status,
            type: AppErrorType.CLIENT,
            validationErrors,
            raw: error,
          };
        case 401:
          return {
            message: 'Unauthorized. Please log in again.',
            status: error.status,
            type: AppErrorType.AUTH,
            raw: error,
          };
        case 403:
          return {
            message: 'Forbidden. You do not have permission to perform this action.',
            status: error.status,
            type: AppErrorType.AUTH,
            raw: error,
          };
        case 404:
          return {
            message: 'The requested resource was not found.',
            status: error.status,
            type: AppErrorType.CLIENT,
            raw: error,
          };
        default:
          if (error.status >= 500) {
            return {
              message: 'A server error occurred. Please try again later.',
              status: error.status,
              type: AppErrorType.SERVER,
              raw: error,
            };
          }
          return {
            message: backendMessage || 'An unexpected error occurred.',
            status: error.status,
            type: AppErrorType.UNKNOWN,
            raw: error,
          };
      }
    }

    // Non-HTTP or unexpected errors (e.g., runtime)
    const message = this.isErrorWithMessage(error)
      ? error.message
      : 'An unexpected application error occurred.';

    return {
      message,
      type: AppErrorType.UNKNOWN,
      raw: error,
    };
  }

  private isErrorWithMessage(error: unknown): error is { message: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: string }).message === 'string'
    );
  }

  notifyError(error: unknown): void {
    const appError = this.getError(error);
    this.toast.showError('Error', appError.message);
  }

  logError(error: unknown): void {
    console.error('App Error Log:', error);
    // TODO: send to monitoring service like Sentry or backend API
  }
}
