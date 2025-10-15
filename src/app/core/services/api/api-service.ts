import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, retry, of, tap } from 'rxjs';

import { ErrorHandlerService } from '@app/core';
import { environment } from '../../../../environments/environment';

export interface ApiRequestOptions {
  retryCount?: number;
  params?: HttpParams | { [param: string]: string | number | boolean };
  headers?: HttpHeaders | { [header: string]: string | string[] };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  BASE_URL = environment.url;

  constructor() {}

  get<T>(url: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.http
      .get<T>(this.fullUrl(url), {
        params: this.buildParams(options.params),
        headers: this.buildHeaders(options.headers),
      })
      .pipe(
        retry(options.retryCount ?? 2),
        catchError((error) => this.handleError(error)),
      );
  }

  post<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.http
      .post<Res>(this.fullUrl(url), body, {
        params: this.buildParams(options.params),
        headers: this.buildHeaders(options.headers),
      })
      .pipe(
        retry(options.retryCount ?? 2),
        catchError((error) => this.handleError(error)),
      );
  }

  put<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.http
      .put<Res>(this.fullUrl(url), body, {
        params: this.buildParams(options.params),
        headers: this.buildHeaders(options.headers),
      })
      .pipe(
        retry(options.retryCount ?? 2),
        catchError((error) => this.handleError(error)),
      );
  }

  delete(url: string, options: ApiRequestOptions = {}): Observable<void> {
    return this.http
      .delete<void>(this.fullUrl(url), {
        params: this.buildParams(options.params),
        headers: this.buildHeaders(options.headers),
      })
      .pipe(
        retry(options.retryCount ?? 2),
        catchError((error) => this.handleError(error)),
      );
  }

  // A Full Url Utility Builder
  private fullUrl(endpoint: string): string {
    // Ensure no double slashes if endpoint starts with /
    return `${this.BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }

  // A Parameter Utitlity Builder
  private buildParams(
    params?: HttpParams | { [param: string]: string | number | boolean },
  ): HttpParams | undefined {
    if (!params) return undefined;
    if (params instanceof HttpParams) return params;

    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      httpParams = httpParams.set(key, value.toString());
    });
    return httpParams;
  }

  // A Header Utility Builder
  private buildHeaders(
    headers?: HttpHeaders | { [header: string]: string | string[] },
  ): HttpHeaders | undefined {
    if (!headers) return undefined;
    if (headers instanceof HttpHeaders) return headers;

    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    Object.entries(headers).forEach(([key, value]) => {
      httpHeaders = httpHeaders.set(key, value);
    });
    return httpHeaders;
  }

  // An Error Handler Wrapper
  private handleError(error: any): Observable<never> {
    const { message } = this.errorHandler.getError(error);
    return throwError(() => new Error(message));
  }
}
