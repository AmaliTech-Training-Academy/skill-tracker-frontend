import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  ForgotPasswordRequest,
  ForgotPasswordSuccessResponse,
  ForgotPasswordErrorResponse,
} from './forgot-password.model';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  // Dummy valid email for simulation
  private readonly dummyUser: ForgotPasswordRequest = {
    email: 'faisal@example.com',
  };

  constructor() {}

  sendResetLink(
    email: string,
  ): Observable<ForgotPasswordSuccessResponse | ForgotPasswordErrorResponse> {
    const apiDelay = 1000;
    const { email: dummyEmail } = this.dummyUser;

    // Simulate valid request
    if (email === dummyEmail) {
      return of({
        message:
          'Password reset request accepted. If the email exists, a recovery link has been sent.',
        data: null,
        metadata: {
          traceId: 'trace-12345',
          timestamp: new Date().toISOString(),
        },
      }).pipe(delay(apiDelay));
    }

    // Simulate error
    return throwError(() => ({
      status: 400,
      message: 'Validation failed.',
      detail: 'The request is missing the required email field.',
      type: 'https://api.skillboost.com/errors/validation-failed',
      instance: '/auth/password/forgot',
      errors: [
        {
          field: 'email',
          message: 'Email address is required or invalid.',
        },
      ],
      metadata: {
        traceId: 'trace-67890',
        timestamp: new Date().toISOString(),
      },
    })).pipe(delay(apiDelay));
  }
}
