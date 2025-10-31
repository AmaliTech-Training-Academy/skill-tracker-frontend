export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    timestamp: string;
    traceId: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  code: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessData {
  message: string;
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

export interface User {
  id: string;
  email: string;
  username: string | null;
  role: string;
  state: string;
  tourStatus: string;
  is_verified: boolean;
  premiumTier: string;
  language: string;
  timezone: string;
}


export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  skillId: string;
  level: SkillLevel | null;
}

export interface CompleteOnboardingRequest {
  skills: UserSkill[];
}

export type RegistrationSuccessResponse = ApiResponse<User>;
export type VerificationSuccessResponse = ApiResponse<User>;
export type LoginSuccessResponse = ApiResponse<LoginSuccessData>;
export type ProfileSuccessResponse = ApiResponse<User>;
export type CompleteOnboardingSuccessResponse = ApiResponse<User>;
