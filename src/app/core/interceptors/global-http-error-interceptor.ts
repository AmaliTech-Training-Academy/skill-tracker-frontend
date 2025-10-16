import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry } from 'rxjs';

import { APP_CONSTANTS } from '../constants/app.constants';
import { AuthService } from '../services/auth/auth-service';
import { ErrorHandlerService } from '../services/error/error-handler';

export const globalHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const authService = inject(AuthService);
  const MAX_RETRIES = APP_CONSTANTS.RETRY.COUNT;

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse) => {
        if (error.status === 0 || error.status >= 500) {
          throw error;
        }
        throw error;
      },
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }

      errorHandler.notifyError(error);

      return throwError(() => error);
    }),
  );
};
