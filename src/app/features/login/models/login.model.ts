export interface Login {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  message: string;
  data: {
    sessionId: string;
    emailMasked: string;
  };
  metadata: {
    traceId: string;
    timestamp: string;
  };
}

export interface LoginErrorResponse {
  status: number;
  message: string;
  detail: string;
  type: string;
  instance: string;
  errors: any | null;
  metadata: {
    traceId: string;
    timestamp: string;
  };
}
