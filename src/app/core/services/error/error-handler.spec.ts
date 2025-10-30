import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler';
import { ToastService } from '../toast/toast-service';
import { AppErrorType } from '../../models/app-error.model';

describe('ErrorHandler', () => {
  let service: ErrorHandlerService;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(() => {
    toastService = {
      showError: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    TestBed.configureTestingModule({
      providers: [ErrorHandlerService, { provide: ToastService, useValue: toastService }],
    });

    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getError', () => {
    it('should handle network errors when offline', () => {
      const onLineSpy = jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      const httpError = new HttpErrorResponse({ status: 0 });
      const result = service.getError(httpError);

      expect(result).toEqual({
        message: 'No internet connection. Please check your network settings.',
        type: AppErrorType.NETWORK,
        raw: httpError,
      });

      onLineSpy.mockRestore();
    });

    it('should handle 400 validation errors', () => {
      const validationErrors = [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password too short' },
      ];

      const httpError = new HttpErrorResponse({
        status: 400,
        error: {
          message: 'Validation failed',
          errors: validationErrors,
        },
      });

      const result = service.getError(httpError);

      expect(result).toEqual({
        message: 'Validation failed',
        detail: undefined,
        status: 400,
        type: AppErrorType.VALIDATION,
        validationErrors,
        raw: httpError,
      });
    });

    it('should handle 401 unauthorized errors', () => {
      const httpError = new HttpErrorResponse({
        status: 401,
        error: { message: 'Invalid credentials' },
      });

      const result = service.getError(httpError);

      expect(result).toEqual({
        message: 'Invalid credentials',
        detail: undefined,
        status: 401,
        type: AppErrorType.AUTH,
        raw: httpError,
      });
    });

    it('should handle 404 not found errors', () => {
      const httpError = new HttpErrorResponse({
        status: 404,
        error: { message: 'Resource not found' },
      });

      const result = service.getError(httpError);

      expect(result).toEqual({
        message: 'Resource not found',
        detail: undefined,
        status: 404,
        type: AppErrorType.CLIENT,
        raw: httpError,
      });
    });

    it('should handle 500 server errors', () => {
      const httpError = new HttpErrorResponse({
        status: 500,
        error: { message: 'Internal server error' },
      });

      const result = service.getError(httpError);

      expect(result).toEqual({
        message: 'A server error occurred. Please try again later.',
        detail: undefined,
        status: 500,
        type: AppErrorType.SERVER,
        raw: httpError,
      });
    });
  });
});
