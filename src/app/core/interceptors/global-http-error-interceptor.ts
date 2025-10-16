import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, tap, retry, timer } from 'rxjs';

import { APP_CONSTANTS } from '../constants/app.constants';
import { AuthService } from '../services/auth/auth-service';
import { ErrorHandlerService } from '../services/error/error-handler';

export const globalHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const authService = inject(AuthService);
  const MAX_RETRIES = APP_CONSTANTS.RETRY.COUNT;
  const RETRY_DELAY_MS = APP_CONSTANTS.RETRY.DELAY_MS;

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse) => {
        if (error.status === 0 || error.status >= 500) {
          return timer(RETRY_DELAY_MS);
        }
        throw error;
      },
    }),
    tap({
      error: (error: HttpErrorResponse) => {
        errorHandler.notifyError(error);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }

      return throwError(() => error);
    }),
  );
};
