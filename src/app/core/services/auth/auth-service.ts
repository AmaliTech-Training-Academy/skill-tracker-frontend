import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import {
  UserResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  CompleteOnboardingRequest,
  UserEmailRequest,
  ResetPasswordRequest,
} from '../../models/auth.model';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { environment } from '../../../../environments/environment';

const { API_ENDPOINTS } = APP_CONSTANTS;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.url;

  constructor(private readonly api: ApiService) {}

  public register(payload: RegisterRequest): Observable<UserResponse> {
    return this.api.post<UserResponse>(API_ENDPOINTS.REGISTER, payload);
  }

  public login(payload: LoginRequest): Observable<UserResponse> {
    return this.api.post<UserResponse>(API_ENDPOINTS.LOGIN, payload);
  }
  public resetPassword(payload: ResetPasswordRequest): Observable<{ message: string }> {
    return this.api.post<{ message: string }>(API_ENDPOINTS.RESET_PASSWORD, payload);
  }

  public forgotPassword(email: string): Observable<{ message: string }> {
    const params = new HttpParams().set('email', email);
    return this.api.post<{ message: string }>(API_ENDPOINTS.FORGOT_PASSWORD, null, { params });
  }

  public verifyEmail({ code, email }: VerifyEmailRequest): Observable<UserResponse> {
    const params = new HttpParams().set('code', code).set('email', email);

    return this.api.post<UserResponse>(API_ENDPOINTS.VERIFY_OTP, null, { params });
  }

  public resendVerification(email: string): Observable<{ message: string }> {
    const params = new HttpParams().set('email', email);
    return this.api.post<{ message: string }>(API_ENDPOINTS.RESEND_VERIFICATION, null, { params });
  }

  public completeOnboarding(payload: CompleteOnboardingRequest): Observable<UserResponse> {
    return this.api.post<UserResponse>(API_ENDPOINTS.COMPLETE_ONBOARDING, payload);
  }

  public updateUserOnboardedState({ email }: UserEmailRequest): Observable<UserResponse> {
    const params = new HttpParams().set('email', email);
    return this.api.post<UserResponse>(API_ENDPOINTS.UPDATE_USER_STATE, null, { params });
  }

  public logout(): Observable<void> {
    return this.api.post<void>(API_ENDPOINTS.LOGOUT, {});
  }

  public initiateSocialLogin(provider: string): void {
    window.location.href = `${this.baseUrl}${API_ENDPOINTS.SOCIAL_LOGIN}/${provider}`;
  }

  public updateTourStatus({ email }: UserEmailRequest): Observable<UserResponse> {
    const params = new HttpParams().set('email', email);
    return this.api.post<UserResponse>(API_ENDPOINTS.UPDATE_TOUR_STATUS, null, { params });
  }

  public getUserProfile(): Observable<UserResponse> {
    return this.api.get<UserResponse>(API_ENDPOINTS.PROFILE);
  }
}
