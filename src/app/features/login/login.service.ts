import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Login, LoginSuccessResponse, LoginErrorResponse } from './models/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // Dummy user data (for simulation)
  private readonly dummyUser: Login = {
    email: 'user@example.com',
    password: 'password',
  };

  constructor() {}

  login(email: string, password: string): Observable<LoginSuccessResponse | LoginErrorResponse> {
    const apiDelay = 1000;

    // Destructure for cleaner access
    const { email: dummyEmail, password: dummyPassword } = this.dummyUser;

    if (email === dummyEmail && password === dummyPassword) {
      // Simulated successful response
      const successResponse: LoginSuccessResponse = {
        message: 'Login successful!',
        data: {
          sessionId: 'abc123',
          emailMasked: 'us***@example.com',
        },
        metadata: {
          traceId: 'trace-xyz',
          timestamp: new Date().toISOString(),
        },
      };

      return of(successResponse).pipe(delay(apiDelay));
    }

    // Simulated error response
    const errorResponse: LoginErrorResponse = {
      status: 401,
      message: 'Invalid email or password.',
      detail: 'Authentication failed',
      type: 'AUTH_ERROR',
      instance: '/login',
      errors: null,
      metadata: {
        traceId: 'trace-err',
        timestamp: new Date().toISOString(),
      },
    };

    return throwError(() => errorResponse).pipe(delay(apiDelay));
  }
}
