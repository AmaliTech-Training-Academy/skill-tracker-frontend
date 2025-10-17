import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from '../../models/app-error.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  getError(error: any): AppError {
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        return {
          message: 'No internet connection. Please check your network settings.',
          type: 'network',
          raw: error,
        };
      }

      const backendMessage =
        error.error?.message ||
        error.error?.error ||
        (typeof error.error === 'string' ? error.error : null);

      const details =
        Array.isArray(error.error?.details) && error.error.details.length > 0
          ? error.error.details
          : undefined;

      switch (error.status) {
        case 400:
          return {
            message: backendMessage || 'Bad request. Please check your input.',
            status: error.status,
            type: 'client',
            details,
            raw: error,
          };
        case 401:
          return {
            message: 'Unauthorized. Please log in again.',
            status: error.status,
            type: 'auth',
            raw: error,
          };
        case 403:
          return {
            message: 'Forbidden. You do not have permission to perform this action.',
            status: error.status,
            type: 'auth',
            raw: error,
          };
        case 404:
          return {
            message: 'The requested resource was not found.',
            status: error.status,
            type: 'client',
            raw: error,
          };
        default:
          if (error.status >= 500) {
            return {
              message: 'A server error occurred. Please try again later.',
              status: error.status,
              type: 'server',
              raw: error,
            };
          }
          return {
            message: backendMessage || 'An unexpected error occurred.',
            status: error.status,
            type: 'unknown',
            raw: error,
          };
      }
    }
    // Non-HTTP or unexpected errors (e.g., runtime)
    return {
      message: error?.message || 'An unexpected application error occurred.',
      type: 'unknown',
      raw: error,
    };
  }

  /**
   * Show an error using a native alert (temporary UI)
   */
  notifyError(error: any): void {
    const appError = this.getError(error);
    window.alert(appError.message);
  }

  /**
   * Log error (extend this to send to Sentry, backend, etc.)
   */
  logError(error: any): void {
    console.error('App Error Log:', error);
    // Future: send to monitoring service like Sentry or backend API
  }
}
