export interface ApiResponse<T> {
  message: string;
  data: T;
}

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

export interface RegistrationData {
  userId: string;
  emailMasked: string;
  sessionId: string;
}

export type RegistrationSuccessResponse = ApiResponse<RegistrationData>;

export interface VerificationData {
  accessToken: string;
  refreshToken: string;
  userProfileId: string;
}

export type VerificationSuccessResponse = ApiResponse<VerificationData>;
