import { HttpParams, HttpHeaders } from '@angular/common/http';

export interface ApiRequestOptions {
  params?: HttpParams | Record<string, string | number | boolean>;
  headers?: HttpHeaders | Record<string, string | string[]>;
}

export interface ValidationDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;

  detail: string | null;
  instance: string;
  errors: ValidationDetail[] | null;
  metadata?: {
    traceId: string;
    timestamp: string;
  };
}
