import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // Dummy user data (for simulation)
  private readonly dummyUser = {
    email: 'user@example.com',
    password: 'password',
  };

  constructor() {}

  login(email: string, password: string): Observable<any> {
    const apiDelay = 1000;

    const { email: dummyEmail, password: dummyPassword } = this.dummyUser;

    if (email === dummyEmail && password === dummyPassword) {
      return of({
        success: true,
        message: 'Login successful!',
        user: { email: dummyEmail },
      }).pipe(delay(apiDelay));
    }

    return throwError(() => ({
      success: false,
      message: 'Invalid email or password.',
    })).pipe(delay(apiDelay));
  }
}
