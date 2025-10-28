import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface ApiRequestOptions {
  params?: HttpParams | Record<string, string | number | boolean>;
  headers?: HttpHeaders | Record<string, string | string[]>;
}

const defaultOptions = {
  withCredentials: true,
};

type HttpClientOptions = ApiRequestOptions & {
  withCredentials?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.url;

  public get<T>(url: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.http.get<T>(this.buildApiUrl(url), this.mergeOptions(options));
  }

  public post<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.http.post<Res>(this.buildApiUrl(url), body, this.mergeOptions(options));
  }

  public update<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.http.put<Res>(this.buildApiUrl(url), body, this.mergeOptions(options));
  }

  public delete(url: string, options: ApiRequestOptions = {}): Observable<void> {
    return this.http.delete<void>(this.buildApiUrl(url), this.mergeOptions(options));
  }

  private buildApiUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }

  private mergeOptions(options: ApiRequestOptions): HttpClientOptions {
    return {
      ...options,
      ...defaultOptions,
    };
  }
}
