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

export enum TourGuide {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum PremiumTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export interface User {
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

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  skillId: string;
  level: SkillLevel | null;
}

export interface CompleteOnboardingRequest {
  skills: UserSkill[];
}

export type UserResponse = ApiResponse<User>;

export interface LoginUser {
  id: string;
  email: string;
  role: string;
  state: string;
  touStatus: string;
  is_verified: boolean;
  premiumTier: string;
  language: string;
  timezone: string;
}

export interface Metadata {
  traceId: string;
  timestamp: string;
}

export interface LoginSuccessResponse {
  success: boolean;
  message: string;
  data: LoginUser;
  metadata: Metadata;
}
