import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private readonly registeredEmail = 'user@example.com';

  constructor() {}

  sendResetLink(email: string): Observable<any> {
    const apiDelay = 1000; // simulate API delay (1s)

    if (email === this.registeredEmail) {
      return of({
        success: true,
        message: 'Password reset link sent successfully to your email.',
      }).pipe(delay(apiDelay));
    } else {
      return throwError(() => ({
        success: false,
        message: 'This email is not registered with us.',
      })).pipe(delay(apiDelay));
    }
  }
}
