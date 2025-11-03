import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiRequestOptions } from '@app/core/models/api.model';

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
  private readonly baseUrl = `${environment.url}/api/v1`;

  public get<T>(url: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.http.get<T>(this.buildApiUrl(url), this.mergeOptions(options));
  }

  public post<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.requestWithBody('post', url, body, options);
  }

  public update<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.requestWithBody('put', url, body, options);
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

  private requestWithBody<Res, Req>(
    method: 'post' | 'put' | 'patch',
    url: string,
    body: Req,
    options: ApiRequestOptions,
  ): Observable<Res> {
    const fullUrl = this.buildApiUrl(url);
    const mergedOptions = this.mergeOptions(options);

    switch (method) {
      case 'post':
        return this.http.post<Res>(fullUrl, body, mergedOptions);
      case 'put':
        return this.http.put<Res>(fullUrl, body, mergedOptions);
      case 'patch':
        return this.http.patch<Res>(fullUrl, body, mergedOptions);
    }
  }
}
