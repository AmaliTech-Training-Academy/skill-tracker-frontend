import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '../services/error/error-handler';
import { AuthService } from '../services/auth/auth-service';
import { catchError, throwError, tap } from 'rxjs';

export const globalHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const authService = inject(AuthService);

  return next(req).pipe(
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
