export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordSuccessResponse {
  message: string;
  data: null;
  metadata: {
    traceId: string;
    timestamp: string;
  };
}

export interface ForgotPasswordErrorResponse {
  status: number;
  message: string;
  detail: string;
  type: string;
  instance: string;
  errors: {
    field: string;
    message: string;
  }[];
  metadata: {
    traceId: string;
    timestamp: string;
  };
}
