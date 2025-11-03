import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  ResetPasswordError,
  ResetPasswordPayload,
  ResetPasswordSuccess,
} from './reset-password.model';

const BASE_URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  constructor(private http: HttpClient) {}

  public resetPassword(payload: ResetPasswordPayload): Observable<string> {
    return this.http.post<ResetPasswordSuccess>(`${BASE_URL}/reset`, payload).pipe(
      map(({ message }) => message),
      catchError((error) => {
        const err: ResetPasswordError = error.error;
        const detail = err?.errors?.[0]?.message || err?.detail || 'Password reset failed.';
        return throwError(() => new Error(detail));
      }),
    );
  }
}
