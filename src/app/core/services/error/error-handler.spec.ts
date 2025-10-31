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
      const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine');
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
      });

      const httpError = new HttpErrorResponse({ status: 0 });
      const result = service.getError(httpError);

      expect(result).toEqual({
        message: 'No internet connection. Please check your network settings.',
        type: AppErrorType.NETWORK,
        raw: httpError,
      });

      if (originalOnLine) Object.defineProperty(navigator, 'onLine', originalOnLine);
    });

    it('should handle generic Error objects', () => {
      const error = new Error('Something went wrong');
      const result = service.getError(error);

      expect(result).toEqual({
        message: 'Something went wrong',
        type: AppErrorType.UNKNOWN,
        raw: error,
      });
    });

    it('should handle unknown errors', () => {
      const error = { details: 'Some details' };
      const result = service.getError(error);

      expect(result).toEqual({
        message: 'An unexpected application error occurred.',
        type: AppErrorType.UNKNOWN,
        raw: error,
      });
    });
  });

  describe('notifyError', () => {
    it('should get the error and show a toast notification', () => {
      const error = new Error('Test error');
      service.notifyError(error);

      expect(toastService.showError).toHaveBeenCalledWith('Error', 'Test error');
    });
  });

  describe('logError', () => {
    it('should log the error to the console', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Logging this error');

      service.logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('App Error Log:', error);

      consoleErrorSpy.mockRestore();
    });
  });
});
