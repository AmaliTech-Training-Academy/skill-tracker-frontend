import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsRegistering = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.isRegistering ?? initialAuthState.isRegistering,
);

export const selectRegistrationError = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.registrationError ?? initialAuthState.registrationError,
);

export const selectRegistrationSuccess = createSelector(
  selectAuthState,
  (state: AuthState | undefined) =>
    state?.registrationSuccess ?? initialAuthState.registrationSuccess,
);

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.user ?? initialAuthState.user,
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.isAuthenticated ?? initialAuthState.isAuthenticated,
);

export const selectIsVerifying = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.isVerifying ?? initialAuthState.isVerifying,
);

export const selectVerificationError = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.verificationError ?? initialAuthState.verificationError,
);

export const selectVerificationSuccess = createSelector(
  selectAuthState,
  (state: AuthState | undefined) =>
    state?.verificationSuccess ?? initialAuthState.verificationSuccess,
);

export const selectIsCompletingOnboarding = createSelector(
  selectAuthState,
  (state: AuthState | undefined) =>
    state?.isCompleteOnboarding ?? initialAuthState.isCompleteOnboarding,
);

export const selectOnboardingError = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.onboardingError ?? initialAuthState.onboardingError,
);

export const selectIsLoggingIn = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.isLoggingIn ?? initialAuthState.isLoggingIn,
);

export const selectLoginError = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.loginError ?? initialAuthState.loginError,
);

export const selectIsSendingResetLink = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.isSendingResetLink ?? false,
);

export const selectForgotPasswordError = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.forgotPasswordError ?? null,
);

export const selectIsResettingPassword = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.isResettingPassword ?? initialAuthState.isResettingPassword,
);

export const selectResetPasswordError = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.resetPasswordError ?? initialAuthState.resetPasswordError,
);

export const selectResetPasswordSuccess = createSelector(
  selectAuthState,
  (state: AuthState | undefined) => state?.resetPasswordSuccess ?? initialAuthState.resetPasswordSuccess,
);
