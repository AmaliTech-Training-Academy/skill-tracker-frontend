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
    // Simulate a short API delay (like a real HTTP call)
    const apiDelay = 1000;

    if (email === this.dummyUser.email && password === this.dummyUser.password) {
      // Simulate successful login
      return of({
        success: true,
        message: 'Login successful!',
        user: {
          email: this.dummyUser.email,
        },
      }).pipe(delay(apiDelay));
    } else {
      // Simulate failed login
      return throwError(() => ({
        success: false,
        message: 'Invalid email or password.',
      })).pipe(delay(apiDelay));
    }
  }
}
