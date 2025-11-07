import { AppError } from '@app/core';
import { User } from '@app/core';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isRegistering: boolean;
  registrationError: AppError | null;
  registrationSuccess: boolean;
  isVerifying: boolean;
  verificationError: AppError | null;
  verificationSuccess: boolean;
  isCompleteOnboarding: boolean;
  onboardingError: AppError | null;
  onboardingSuccess: boolean;
  isLoggingIn: boolean;
  loginError: AppError | null;
  isLoggingOut: boolean;
  logoutError: AppError | null;
  isUpdatingTourStatus: boolean;
  updateTourStatusError: AppError | null;
  isResettingPassword: boolean;
  resetPasswordError: AppError | null;
  resetPasswordSuccess: boolean;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isRegistering: false,
  registrationError: null,
  registrationSuccess: false,
  isVerifying: false,
  verificationError: null,
  verificationSuccess: false,
  isCompleteOnboarding: false,
  onboardingError: null,
  onboardingSuccess: false,
  isLoggingIn: false,
  loginError: null,
  isLoggingOut: false,
  logoutError: null,
  isUpdatingTourStatus: false,
  updateTourStatusError: null,
  isResettingPassword: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
};
