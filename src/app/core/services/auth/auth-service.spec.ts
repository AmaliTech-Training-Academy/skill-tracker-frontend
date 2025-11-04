import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';
import { ApiService } from '../api/api-service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';

import { CompleteOnboardingRequest, UserSkill, SkillLevel } from '../../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'http://mock-api.com';

  beforeEach(() => {
    environment.url = mockApiUrl;

    TestBed.configureTestingModule({
      providers: [AuthService, ApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('completeOnboarding', () => {
    it('should send POST request to complete onboarding endpoint with payload', () => {
      const mockPayload: CompleteOnboardingRequest = {
        skills: [
          { skillId: 'JavaScript', level: 'Beginner' },
          { skillId: 'Angular', level: 'Intermediate' },
        ],
      };
      const mockResponse = { message: 'Onboarding completed successfully' };

      const apiPostSpy = jest.spyOn(apiService, 'post').mockReturnValue(of(mockResponse));

      service.completeOnboarding(mockPayload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiPostSpy).toHaveBeenCalledWith(
        APP_CONSTANTS.API_ENDPOINTS.COMPLETE_ONBOARDING,
        mockPayload,
      );
    });
  });

  describe('register', () => {
    it('should send POST request with correct payload', () => {
      const mockPayload = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResponse = {
        message: 'Registration successful',
      };

      service.register(mockPayload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/v1${APP_CONSTANTS.API_ENDPOINTS.REGISTER}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPayload);
      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should send POST request with login credentials', () => {
      const mockPayload = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'fake-jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
        },
      };

      service.login(mockPayload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      // <-- FIX 6: Add /api/v1 prefix
      const req = httpMock.expectOne(`${mockApiUrl}/api/v1${APP_CONSTANTS.API_ENDPOINTS.LOGIN}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPayload);
      req.flush(mockResponse);
    });
  });

  describe('verifyOtp', () => {
    it('should send POST request with code and email as params', () => {
      const code = '123456';
      const email = 'test@example.com';
      const mockResponse = {
        message: 'Verification successful',
      };

      service.verifyEmail({ code, email }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${mockApiUrl}/api/v1${APP_CONSTANTS.API_ENDPOINTS.VERIFY_OTP}?code=${code}&email=${email}`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should send POST request to logout endpoint', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/api/v1${APP_CONSTANTS.API_ENDPOINTS.LOGOUT}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });
});
