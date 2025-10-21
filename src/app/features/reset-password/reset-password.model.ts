export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordSuccess {
  message: string;
  data: null;
  metadata: {
    traceId: string;
    timestamp: string;
  };
}

export interface ResetPasswordError {
  status: number;
  message: string;
  detail: string;
  type: string;
  instance: string;
  errors: { field: string; message: string }[];
  metadata: {
    traceId: string;
    timestamp: string;
  };
}
