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

export interface ApiMetadata {
  traceId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata: ApiMetadata;
}

export function isApiErrorResponse(body: unknown): body is ApiErrorResponse {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  return (
    'status' in body &&
    typeof (body as ApiErrorResponse).status === 'number' &&
    'message' in body &&
    typeof (body as ApiErrorResponse).message === 'string' &&
    'instance' in body &&
    typeof (body as ApiErrorResponse).instance === 'string' &&
    'detail' in body &&
    typeof (body as ApiErrorResponse).message === 'string'
  );
}
