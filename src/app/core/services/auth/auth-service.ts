import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import {
  LoginSuccessResponse,
  UserResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  CompleteOnboardingRequest,
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

   public login(payload: LoginRequest): Observable<LoginSuccessResponse> {
    return this.api.post<LoginSuccessResponse>(API_ENDPOINTS.LOGIN, payload);
  }

  public verifyEmail({ code, email }: VerifyEmailRequest): Observable<UserResponse> {
    const params = new HttpParams().set('code', code).set('email', email);

    return this.api.post<UserResponse>(API_ENDPOINTS.VERIFY_OTP, null, { params });
  }

  public completeOnboarding(payload: CompleteOnboardingRequest): Observable<UserResponse> {
    return this.api.post<UserResponse>(API_ENDPOINTS.COMPLETE_ONBOARDING, payload);
  }
  public logout(): Observable<void> {
    return this.api.post<void>(API_ENDPOINTS.LOGOUT, {});
  }

  public initiateSocialLogin(provider: string): void {
    window.location.href = `${this.baseUrl}${API_ENDPOINTS.SOCIAL_LOGIN}/${provider}`;
  }
}
