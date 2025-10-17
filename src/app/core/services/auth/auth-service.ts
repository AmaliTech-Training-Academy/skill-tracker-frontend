import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api-service';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AuthResponse,
  RegisterRequest,
  RegistrationSuccessResponse,
  VerificationSuccessResponse,
  LoginRequest,
} from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    private readonly router: Router,
    private readonly api: ApiService,
  ) {}

  private readonly SESSION_ID_KEY = 'temp_session_id';
  readonly registrationSessionId = signal<string | null>(this.getTempSessionId());

  readonly isAuthenticated = signal<boolean>(this.hasToken());
  readonly currentUser = signal<AuthResponse['user'] | null>(null);
  private readonly isMocking = true;
  private readonly MOCK_LATENCY_MS = 1000;

  register(payload: RegisterRequest): Observable<RegistrationSuccessResponse> {
    const MOCK_SESSION_ID = 'mock-sess-87654321';

    // --- MOCK LOGIC ---
    if (this.isMocking) {
      if (payload.email === 'test@exists.com') {
        const mockHttpError = new HttpErrorResponse({
          status: 400,
          error: {
            message: 'Registration failed due to invalid data.',
            errors: [{ field: 'email', message: 'Email already registered.' }],
          },
          url: 'auth/register',
          statusText: 'Bad Request',
        });
        return throwError(() => mockHttpError).pipe(delay(this.MOCK_LATENCY_MS));
      }

      const mockResponse: RegistrationSuccessResponse = {
        message: 'User registered successfully!',
        data: {
          userId: 'usr_mock_123',
          emailMasked: 't***@example.com',
          sessionId: MOCK_SESSION_ID,
        },
      };

      return of(mockResponse).pipe(
        delay(this.MOCK_LATENCY_MS),
        tap((response) => {
          const { sessionId } = response.data;
          this.setTempSessionId(sessionId);
          this.registrationSessionId.set(sessionId);
        }),
      );
    }

    // --- REAL API LOGIC ---
    return this.api.post<RegistrationSuccessResponse>('auth/register', payload).pipe(
      tap((response) => {
        const { sessionId } = response.data;
        if (sessionId) {
          this.setTempSessionId(sessionId);
          this.registrationSessionId.set(sessionId);
        } else {
          throw new Error('Registration failed: Missing session identifier.');
        }
      }),
    );
  }

  verifyOtp(sessionId: string, otp: string): Observable<VerificationSuccessResponse> {
    const MOCK_ACCESS_TOKEN = 'mock-access-token-12345';
    const MOCK_REFRESH_TOKEN = 'mock-refresh-token-67890';
    const MOCK_USER_ID = 'usr_mock_123';
    const MOCK_LATENCY_MS = 1000;

    // --- MOCK LOGIC ---
    if (this.isMocking) {
      if (otp === '000000') {
        const mockHttpError = new HttpErrorResponse({
          status: 400,
          error: { message: 'Invalid or expired verification code.', errors: [] },
          url: 'auth/verify-email-otp',
          statusText: 'Bad Request',
        });

        return throwError(() => mockHttpError).pipe(delay(MOCK_LATENCY_MS));
      }
      if (sessionId === 'invalid-session') {
        const mockHttpError = new HttpErrorResponse({
          status: 404,
          error: { message: 'Session not found.', errors: [] },
          url: 'auth/verify-email-otp',
          statusText: 'Not Found',
        });
        return throwError(() => mockHttpError).pipe(delay(this.MOCK_LATENCY_MS));
      }

      const mockResponse: VerificationSuccessResponse = {
        message: 'Account verified and user session created successfully!',
        data: {
          accessToken: MOCK_ACCESS_TOKEN,
          refreshToken: MOCK_REFRESH_TOKEN,
          userProfileId: MOCK_USER_ID,
        },
      };

      return of(mockResponse).pipe(
        delay(MOCK_LATENCY_MS),
        tap((response) => {
          const { accessToken, refreshToken } = response.data;
          this.setTokens(accessToken, refreshToken);
          this.clearTempSessionId();
          this.isAuthenticated.set(true);
          this.router.navigateByUrl('/onboarding');
        }),
      );
    }

    const payload = { sessionId, otp };
    return this.api.post<VerificationSuccessResponse>('auth/verify-email-otp', payload).pipe(
      tap((response) => {
        const { accessToken, refreshToken, userProfileId } = response.data;
        this.setTokens(accessToken, refreshToken);
        this.clearTempSessionId();
        this.isAuthenticated.set(true);
        this.currentUser.set({ id: userProfileId, name: '', email: '' });
        this.router.navigateByUrl('/onboarding');
      }),
    );
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    // --- MOCK LOGIN LOGIC ---
    if (this.isMocking) {
      if (payload.email === 'user@fail.com') {
        const mockHttpError = new HttpErrorResponse({
          status: 401,
          error: { message: 'Invalid credentials or account not verified.', errors: [] },
          url: 'auth/login',
          statusText: 'Unauthorized',
        });
        return throwError(() => mockHttpError).pipe(delay(this.MOCK_LATENCY_MS));
      }

      const mockResponse: AuthResponse = {
        accessToken: 'mock-auth-token-valid',
        refreshToken: 'mock-refresh-token-valid',
        user: { id: 456, name: 'Skill User', email: payload.email },
      };

      return of(mockResponse).pipe(
        delay(this.MOCK_LATENCY_MS),
        tap((response) => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.isAuthenticated.set(true);
          this.currentUser.set(response.user);
          this.router.navigateByUrl('/dashboard');
        }),
      );
    }

    return this.api.post<AuthResponse>('auth/login', payload).pipe(
      tap((response) => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.isAuthenticated.set(true);
        this.currentUser.set(response.user);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private getTempSessionId(): string | null {
    return localStorage.getItem(this.SESSION_ID_KEY);
  }

  private setTempSessionId(sessionId: string): void {
    localStorage.setItem(this.SESSION_ID_KEY, sessionId);
  }

  private clearTempSessionId(): void {
    localStorage.removeItem(this.SESSION_ID_KEY);
    this.registrationSessionId.set(null);
  }
}
