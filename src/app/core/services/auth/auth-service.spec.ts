import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth-service';
import { ApiService } from '../api/api-service';
import { APP_CONSTANTS } from '@app/core';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ApiService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
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

      const req = httpMock.expectOne(`${environment.url}/${APP_CONSTANTS.API_ENDPOINTS.REGISTER}`);
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

      const req = httpMock.expectOne(`${environment.url}/${APP_CONSTANTS.API_ENDPOINTS.LOGIN}`);
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

      service.verifyOtp(code, email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.url}/${APP_CONSTANTS.API_ENDPOINTS.VERIFY_OTP}?code=${code}&email=${email}`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should send POST request to logout endpoint', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${environment.url}/${APP_CONSTANTS.API_ENDPOINTS.LOGOUT}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });
});
