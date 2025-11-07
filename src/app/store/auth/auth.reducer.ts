import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import {
  registerUser,
  registerUserSuccess,
  registerUserFailure,
  verifyEmailOtp,
  verifyEmailOtpFailure,
  verifyEmailOtpSuccess,
  completeOnboarding,
  completeOnboardingSuccess,
  completeOnboardingFailure,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSuccess,
  logoutFailure,
  updateTourStatus,
  updateTourStatusSuccess,
  updateTourStatusFailure,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordResetState,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
} from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(registerUser, (state) => ({
    ...state,
    isRegistering: true,
    registrationError: null,
    registrationSuccess: false,
  })),
  on(registerUserSuccess, (state, { user }) => ({
    ...state,
    isRegistering: false,
    registrationSuccess: true,
    user,
    isAuthenticated: true,
    registrationError: null,
  })),
  on(registerUserFailure, (state, { error }) => ({
    ...state,
    isRegistering: false,
    registrationSuccess: false,
    registrationError: error,
  })),
  on(verifyEmailOtp, (state) => ({
    ...state,
    isVerifying: true,
    verificationSuccess: false,
    verificationError: null,
  })),
  on(verifyEmailOtpSuccess, (state, { user }) => ({
    ...state,
    isVerifying: false,
    user,
    isAuthenticated: true,
  })),
  on(verifyEmailOtpFailure, (state, { error }) => ({
    ...state,
    isVerifying: false,
    verificationError: error,
  })),
  on(completeOnboarding, (state, { request }) => ({
    ...state,
    isCompleteOnboarding: true,
    onboardingError: null,
  })),
  on(completeOnboardingSuccess, (state, { user }) => ({
    ...state,
    isCompleteOnboarding: false,
    user,
  })),
  on(completeOnboardingFailure, (state, { error }) => ({
    ...state,
    isCompleteOnboarding: false,
    onboardingError: error,
  })),
  on(login, (state, { request }) => ({
    ...state,
    isLoggingIn: true,
    loginError: null,
  })),
  on(loginSuccess, (state, { user }) => ({
    ...state,
    isLoggingIn: false,
    isAuthenticated: true,
    user,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    isLoggingIn: false,
    loginError: error,
  })),
  on(logout, (state) => ({
    ...state,
    isLoggingOut: true,
    logoutError: null,
  })),
  on(logoutSuccess, (state) => ({
    ...initialAuthState,
  })),
  on(logoutFailure, (state, { error }) => ({
    ...state,
    isLoggingOut: false,
    logoutError: error,
  })),
  on(forgotPassword, (state) => ({
    ...state,
    isRequestingPasswordReset: true,
    passwordResetError: null,
    passwordResetSuccess: false,
  })),
  on(forgotPasswordSuccess, (state) => ({
    ...state,
    isRequestingPasswordReset: false,
    passwordResetSuccess: true,
    passwordResetError: null,
  })),
  on(forgotPasswordFailure, (state, { error }) => ({
    ...state,
    isRequestingPasswordReset: false,
    passwordResetSuccess: false,
    passwordResetError: error,
  })),
  on(resetPasswordResetState, (state) => ({
    ...state,
    isRequestingPasswordReset: false,
    passwordResetError: null,
    passwordResetSuccess: false,
  })),
  on(updateTourStatus, (state) => ({
    ...state,
    isUpdatingTourStatus: true,
    updateTourStatusError: null,
  })),

  on(updateTourStatusSuccess, (state, { user }) => ({
    ...state,
    isUpdatingTourStatus: false,
    user: user,
    updateTourStatusError: null,
  })),

  on(updateTourStatusFailure, (state, { error }) => ({
    ...state,
    isUpdatingTourStatus: false,
    updateTourStatusError: error,
  })),
  on(resetPassword, (state) => ({
    ...state,
    isResettingPassword: true,
    resetPasswordError: null,
    resetPasswordSuccess: false,
  })),
  on(resetPasswordSuccess, (state) => ({
    ...state,
    isResettingPassword: false,
    resetPasswordSuccess: true,
  })),
  on(resetPasswordFailure, (state, { error }) => ({
    ...state,
    isResettingPassword: false,
    resetPasswordError: error,
    resetPasswordSuccess: false,
  })),
);
