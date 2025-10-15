import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { APP_CONSTANTS } from '../constants/app.constants';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const MAX_RETRIES = APP_CONSTANTS.RETRY.COUNT;
  const RETRY_DELAY_MS = APP_CONSTANTS.RETRY.DELAY_MS;

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse) => {
        if (error.status === 0 || error.status >= 500) {
          console.log(`Retrying after error: ${error.status}`);
          return timer(RETRY_DELAY_MS);
        }
        throw error;
      },
    }),
  );
};
