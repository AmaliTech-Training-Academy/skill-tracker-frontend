import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth/auth-service';
import { ToastService } from '../services/toast/toast-service';
import { ErrorHandlerService } from '../services/error/error-handler';

export const globalHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const errorHandlerService = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }

      const isNetworkError = error.status === 0;
      const isServerError = error.status >= 500 && error.status < 600;

      if (isNetworkError || isServerError) {
        const appError = errorHandlerService.getError(error);

        toastService.showError('Error', appError.message);
      }
      
      return throwError(() => error);
    }),
  );
};
