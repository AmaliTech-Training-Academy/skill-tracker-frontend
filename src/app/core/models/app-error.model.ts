export interface AppError {
  message: string;
  status?: number;
  type?: 'network' | 'server' | 'auth' | 'client' | 'unknown';
  details?: string[];
  raw?: any; // original error object for debugging
}
