import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApiService } from './api-service';
import { environment } from '../../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(withFetch()), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make a GET request with correct URL', () => {
      const testData = { id: 1, name: 'Test' };

      service.get<any>('/test').subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(`${environment.url}/test`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(testData);
    });

    it('should handle query parameters', () => {
      service.get('/test', { params: { id: '1' } }).subscribe();

      const req = httpMock.expectOne(`${environment.url}/test?id=1`);
      expect(req.request.params.get('id')).toBe('1');
    });

    it('should handle headers', () => {
      const headers = { 'Content-Type': 'application/json' };
      service.get('/test', { headers }).subscribe();

      const req = httpMock.expectOne(`${environment.url}/test`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
    });

    it('should merge default options with provided options', () => {
      const customOptions = {
        headers: { 'Custom-Header': 'test' },
        params: { page: '1' },
      };

      service.get('/test', customOptions).subscribe();

      const req = httpMock.expectOne(`${environment.url}/test?page=1`);
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.headers.get('Custom-Header')).toBe('test');
      expect(req.request.params.get('page')).toBe('1');
    });

    it('should handle errors', (done) => {
      service.get('/test').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.url}/test`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should properly build URL with and without leading slash', () => {
      service.get('test').subscribe();
      let req = httpMock.expectOne(`${environment.url}/test`);
      req.flush({});

      service.get('/test').subscribe();
      req = httpMock.expectOne(`${environment.url}/test`);
      req.flush({});
    });
  });

  describe('POST requests', () => {
    it('should make a POST request with body', () => {
      const testBody = { name: 'Test' };
      const testResponse = { id: 1, name: 'Test' };

      service.post('/test', testBody).subscribe((response) => {
        expect(response).toEqual(testResponse);
      });

      const req = httpMock.expectOne(`${environment.url}/test`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testBody);
      req.flush(testResponse);
    });
  });

  describe('PUT requests', () => {
    it('should make a PUT request with body', () => {
      const testBody = { id: 1, name: 'Updated' };
      const testResponse = { id: 1, name: 'Updated' };

      service.update('/test', testBody).subscribe((response) => {
        expect(response).toEqual(testResponse);
      });

      const req = httpMock.expectOne(`${environment.url}/test`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(testBody);
      req.flush(testResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make a DELETE request', () => {
      service.delete('/test').subscribe();

      const req = httpMock.expectOne(`${environment.url}/test`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP errors', () => {
      service.get('/test').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${environment.url}/test`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
