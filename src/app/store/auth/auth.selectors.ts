import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsRegistering = createSelector(
  selectAuthState,
  (state: AuthState) => state.isRegistering,
);

export const selectRegistrationError = createSelector(
  selectAuthState,
  (state: AuthState) => state.registrationError,
);

export const selectRegistrationSuccess = createSelector(
  selectAuthState,
  (state: AuthState) => state.registrationSuccess,
);

export const selectCurrentUser = createSelector(selectAuthState, (state: AuthState) => state.user);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated,
);

export const selectIsVerifying = createSelector(
  selectAuthState,
  (state: AuthState) => state.isVerifying,
);

export const selectVerificationError = createSelector(
  selectAuthState,
  (state: AuthState) => state.verificationError,
);

export const selectVerificationSuccess = createSelector(
  selectAuthState,
  (state: AuthState) => state.verificationSuccess,
);

export const selectIsCompletingOnboarding = createSelector(
  selectAuthState,
  (state: AuthState) => state.isCompleteOnboarding,
);

export const selectOnboardingError = createSelector(
  selectAuthState,
  (state: AuthState) => state.onboardingError,
);

export const selectUserEmail = createSelector(
  selectAuthState,
  (state: AuthState) => state.user?.email ?? null,
);
export const selectIsLoggingIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggingIn,
);

export const selectLoginError = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginError,
);
export const selectIsRequestingPasswordReset = createSelector(
  selectAuthState,
  (state: AuthState) => state.isRequestingPasswordReset,
);

export const selectPasswordResetError = createSelector(
  selectAuthState,
  (state: AuthState) => state.passwordResetError,
);

export const selectIsResettingPassword = createSelector(
  selectAuthState,
  (state: AuthState) => state.isResettingPassword,
);

export const selectResetPasswordError = createSelector(
  selectAuthState,
  (state: AuthState) => state.resetPasswordError,
);

export const selectResetPasswordSuccess = createSelector(
  selectAuthState,
  (state: AuthState) => state.resetPasswordSuccess,
);

export const selectIsLoggingOut = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggingOut,
);

export const selectIsAuthCheckComplete = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthCheckComplete,
);
