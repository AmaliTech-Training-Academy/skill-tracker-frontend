import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppError, AppErrorType } from '../../models/app-error.model';
import { ApiErrorResponse, ValidationDetail } from '@app/core/models/api.model';
import { ToastService } from '../toast/toast-service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toast: ToastService) {}

  public getError(error: unknown): AppError {
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        return {
          message: 'No internet connection. Please check your network settings.',
          type: AppErrorType.NETWORK,
          raw: error,
        };
      }

      const backendErrorBody = error.error as ApiErrorResponse;

      const backendMessage = backendErrorBody.message;
      const backendDetail = backendErrorBody.detail;

      let validationErrors: ValidationDetail[] | undefined;
      const rawValidationErrors = backendErrorBody.errors;

      if (Array.isArray(rawValidationErrors) && rawValidationErrors.length) {
        validationErrors = rawValidationErrors.map((err) => ({
          field: err.field || 'general',
          message: err.message || 'Validation failed for a field.',
        }));
      }

      const errorType400 = validationErrors ? AppErrorType.VALIDATION : AppErrorType.CLIENT;
      const isServerError = error.status >= 500 && error.status < 600;

      switch (error.status) {
        case 400:
          return {
            message: backendMessage || 'Bad request. Please check your input.',
            detail: backendDetail,
            status: error.status,
            type: errorType400,
            validationErrors,
            raw: error,
          };
        case 401:
          return {
            message: backendMessage || 'Unauthorized. Please log in again.',
            detail: backendDetail,
            status: error.status,
            type: AppErrorType.AUTH,
            raw: error,
          };
        case 403:
          return {
            message:
              backendMessage || 'Forbidden. You do not have permission to perform this action.',
            detail: backendDetail,
            status: error.status,
            type: AppErrorType.AUTH,
            raw: error,
          };
        case 404:
          return {
            message: backendMessage || 'The requested resource was not found.',
            detail: backendDetail,
            status: error.status,
            type: AppErrorType.CLIENT,
            raw: error,
          };
        case 409:
          return {
            message: backendMessage || 'Data conflict. Please review your request.',
            detail: backendDetail,
            status: error.status,
            type: AppErrorType.CLIENT,
            raw: error,
          };
        default:
          return {
            message: isServerError
              ? 'A server error occurred. Please try again later.'
              : backendMessage || 'An unexpected error occurred.',
            detail: backendDetail,
            status: error.status,
            type: isServerError ? AppErrorType.SERVER : AppErrorType.UNKNOWN,
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

  public notifyError(error: unknown): void {
    const appError = this.getError(error);
    this.toast.showError('Error', appError.message);
  }

  public logError(error: unknown): void {
    console.error('App Error Log:', error);
    // TODO: send to monitoring service like Sentry or backend API
  }
}
