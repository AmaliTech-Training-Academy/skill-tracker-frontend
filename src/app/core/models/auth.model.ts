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
  ONBOARDED = 'ONBOARDED',
  SUSPENDED = 'SUSPENDED',
}

export enum TourGuide {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum PremiumTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export interface UserApiResponse {
  id: string;
  email: string;
  username: string | null;
  role: UserRole;
  state: UserState;
  tourStatus?: TourGuide;
  is_verified: boolean;
  premiumTier: PremiumTier;
  language: string;
  timezone: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string | null;
  role: UserRole;
  state: UserState;
  tourStatus?: TourGuide;
  isVerified: boolean;
  premiumTier: PremiumTier;
  language: string;
  timezone: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function mapUserApiResponseToUser({ is_verified, ...apiUser }: UserApiResponse): User {
  return {
    ...apiUser,
    isVerified: is_verified,
  };
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | null;

export interface UserSkill {
  skillId: string;
  level: SkillLevel | null;
}

export interface CompleteOnboardingRequest {
  skills: UserSkill[];
}

export interface UpdateUserStateRequest {
  email: string;
}

export type UserResponse = ApiResponse<UserApiResponse>;
