// mock service
//actual service is implemented implemented by victor
import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  sendResetLink(email: string): Observable<{ message: string }> {
    // Simulate valid/invalid email
    const isValid = email.endsWith('@example.com');

    if (isValid) {
      return of({ message: 'Reset link sent successfully!' }).pipe(delay(2000));
    } else {
      return throwError(() => new Error('Email not found')).pipe(delay(2000));
    }
  }
}

// mock service
