import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface ApiRequestOptions {
  params?: HttpParams | { [param: string]: string | number | boolean };
  headers?: HttpHeaders | { [header: string]: string | string[] };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly BASE_URL = environment.url;

  constructor() {}

  get<T>(url: string, options: ApiRequestOptions = {}): Observable<T> {
    return this.http.get<T>(this.buildApiUrl(url), options);
  }

  post<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.http.post<Res>(this.buildApiUrl(url), body, options);
  }

  update<Res, Req = unknown>(
    url: string,
    body: Req,
    options: ApiRequestOptions = {},
  ): Observable<Res> {
    return this.http.put<Res>(this.buildApiUrl(url), body, options);
  }

  delete(url: string, options: ApiRequestOptions = {}): Observable<void> {
    return this.http.delete<void>(this.buildApiUrl(url), options);
  }

  private buildApiUrl(endpoint: string): string {
    return `${this.BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }
}
