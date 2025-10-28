import { HttpStatusCode } from '@angular/common/http';

export enum AppErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  AUTH = 'auth',
  VALIDATION = 'validation',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

export interface ValidationDetail {
  field: string;
  message: string;
}

export interface AppError {
  message: string;
  detail?: string;
  status?: HttpStatusCode | number;
  type?: AppErrorType;
  validationErrors?: ValidationDetail[];
  raw?: unknown;
}
