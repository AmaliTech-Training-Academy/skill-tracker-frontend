import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import {
  LoginSuccessResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  RegistrationSuccessResponse,
  VerificationSuccessResponse,
  CompleteOnboardingRequest,
  CompleteOnboardingSuccessResponse,
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

  public login(payload: LoginRequest): Observable<LoginSuccessResponse> {
    return this.api.post<LoginSuccessResponse>(API_ENDPOINTS.LOGIN, payload);
  }

  public forgotPassword(email: string): Observable<void> {
  return this.api.post<void>(API_ENDPOINTS.FORGOT_PASSWORD, { email });
}


  public verifyEmail(payload: VerifyEmailRequest): Observable<VerificationSuccessResponse> {
    const params = new HttpParams().set('code', payload.code).set('email', payload.email);

    return this.api.post<VerificationSuccessResponse>(API_ENDPOINTS.VERIFY_OTP, null, { params });
  }

  public completeOnboarding(
    payload: CompleteOnboardingRequest,
  ): Observable<CompleteOnboardingSuccessResponse> {
    return this.api.post<CompleteOnboardingSuccessResponse>(
      API_ENDPOINTS.COMPLETE_ONBOARDING,
      payload,
    );
  }
  public logout(): Observable<void> {
    return this.api.post<void>(API_ENDPOINTS.LOGOUT, {});
  }
}
