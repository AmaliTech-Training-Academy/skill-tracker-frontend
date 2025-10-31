import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.registerUser, (state) => ({
    ...state,
    isRegistering: true,
    registrationError: null,
    registrationSuccess: false,
  })),
  on(AuthActions.registerUserSuccess, (state, { user }) => ({
    ...state,
    isRegistering: false,
    registrationSuccess: true,
    user,
    isAuthenticated: true,
    registrationError: null,
  })),
  on(AuthActions.registerUserFailure, (state, { error }) => ({
    ...state,
    isRegistering: false,
    registrationSuccess: false,
    registrationError: error,
  })),
  on(AuthActions.verifyEmailOtp, (state) => ({
    ...state,
    isVerifying: true,
    verificationSuccess: false,
    verificationError: null,
  })),
  on(AuthActions.verifyEmailOtpSuccess, (state, { user }) => ({
    ...state,
    isVerifying: false,
    user,
    isAuthenticated: true,
  })),
  on(AuthActions.verifyEmailOtpFailure, (state, { error }) => ({
    ...state,
    isVerifying: false,
    verificationError: error,
  })),
  on(AuthActions.completeOnboarding, (state, { request }) => ({
    ...state,
    isCompleteOnboarding: true,
    onboardingError: null,
  })),
  on(AuthActions.completeOnboardingSuccess, (state, { user }) => ({
    ...state,
    isCompleteOnboarding: false,
    user,
  })),
  on(AuthActions.completeOnboardingFailure, (state, { error }) => ({
    ...state,
    isCompleteOnboarding: false,
    onboardingError: error,
  })),
  on(AuthActions.login, (state, { request }) => ({
    ...state,
    isLoggingIn: true,
    loginError: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    isLoggingIn: false,
    isAuthenticated: true,
    user,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoggingIn: false,
    loginError: error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoggingOut: true,
    logoutError: null,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...initialAuthState,
  })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    isLoggingOut: false,
    logoutError: error,
  })),
    on(AuthActions.forgotPassword, (state) => ({
    ...state,
    isSendingResetLink: true,
    forgotPasswordError: null,
  })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    isSendingResetLink: false,
    forgotPasswordError: null,
  })),
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    isSendingResetLink: false,
    forgotPasswordError: error,
  })),

  on(AuthActions.resetForgotPasswordState, (state) => ({
  ...state,
  isSendingResetLink: false,
  forgotPasswordError: null,
})),

);
