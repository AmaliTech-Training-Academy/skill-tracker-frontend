export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: number | string; name: string; email: string };
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationSuccessResponse {
  message: string;
  data: {
    userId: string;
    emailMasked: string;
    sessionId: string;
  };
}

export interface VerificationSuccessResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userProfileId: string;
  };
}
