import { HttpStatusCode } from '@angular/common/http';
import { ValidationDetail } from './api.model';

export enum AppErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  AUTH = 'auth',
  VALIDATION = 'validation',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

export interface AppError {
  message: string;
  detail?: string | null;
  status?: HttpStatusCode | number;
  type?: AppErrorType;
  errors?: { field?: string; message?: string }[];
  validationErrors?: ValidationDetail[];
  raw?: unknown;
}
