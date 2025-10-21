export enum AppErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  AUTH = 'auth',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

export interface ValidationDetail {
  field: string;
  message: string;
}

export interface AppError {
  message: string;
  status?: number;
  type?: AppErrorType;
  validationErrors?: ValidationDetail[];
  raw?: unknown;
}
