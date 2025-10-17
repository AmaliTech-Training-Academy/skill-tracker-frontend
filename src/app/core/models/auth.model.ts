export interface AuthResponse {
  token: string;
  user: { id: number | string; name: string; email: string };
  accessToken: string;
  refreshToken: string;
  userProfileId: string;
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
