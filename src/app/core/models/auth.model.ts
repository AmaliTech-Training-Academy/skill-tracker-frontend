export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    timestamp: string;
    traceId: string;
  };
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

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserState {
  REGISTERED = 'REGISTERED',
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
}

export enum PremiumTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export interface RegistrationData {
  id: string;
  email: string;
  username: string | null;
  role: UserRole;
  state: UserState;
  isVerified: boolean;
  premiumTier: PremiumTier;
  language: string;
  timezone: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export type RegistrationSuccessResponse = ApiResponse<RegistrationData>;

export type VerificationSuccessResponse = ApiResponse<RegistrationData>;
