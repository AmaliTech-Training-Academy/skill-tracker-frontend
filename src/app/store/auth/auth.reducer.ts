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
);
