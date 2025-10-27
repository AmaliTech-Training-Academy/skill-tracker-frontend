import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegistrationSuccessResponse,
  VerificationSuccessResponse,
} from '../../models/auth.model';
import { APP_CONSTANTS } from '@app/core';

const { API_ENDPOINTS } = APP_CONSTANTS;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly api: ApiService) {}

  public register(payload: RegisterRequest): Observable<RegistrationSuccessResponse> {
    return this.api.post<RegistrationSuccessResponse>(API_ENDPOINTS.REGISTER, payload);
  }

  public login(payload: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(API_ENDPOINTS.LOGIN, payload);
  }

  public verifyOtp(code: string, email: string): Observable<VerificationSuccessResponse> {
    const params = new HttpParams().set('code', code).set('email', email);

    return this.api.post<VerificationSuccessResponse>(API_ENDPOINTS.VERIFY_OTP, null, { params });
  }

  public logout(): Observable<void> {
    return this.api.post<void>(API_ENDPOINTS.LOGOUT, {});
  }
}
