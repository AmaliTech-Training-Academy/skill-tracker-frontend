import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsRegistering = createSelector(
  selectAuthState,
  ({ isRegistering }: AuthState) => isRegistering,
);

export const selectRegistrationError = createSelector(
  selectAuthState,
  ({ registrationError }: AuthState) => registrationError,
);

export const selectRegistrationSuccess = createSelector(
  selectAuthState,
  ({ registrationSuccess }: AuthState) => registrationSuccess,
);

export const selectCurrentUser = createSelector(selectAuthState, ({ user }: AuthState) => user);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  ({ isAuthenticated }: AuthState) => isAuthenticated,
);

export const selectIsVerifying = createSelector(
  selectAuthState,
  ({ isVerifying }: AuthState) => isVerifying,
);

export const selectVerificationError = createSelector(
  selectAuthState,
  ({ verificationError }: AuthState) => verificationError,
);

export const selectVerificationSuccess = createSelector(
  selectAuthState,
  ({ verificationSuccess }: AuthState) => verificationSuccess,
);

export const selectIsCompletingOnboarding = createSelector(
  selectAuthState,
  ({ isCompleteOnboarding }: AuthState) => isCompleteOnboarding,
);

export const selectOnboardingError = createSelector(
  selectAuthState,
  ({ onboardingError }: AuthState) => onboardingError,
);

export const selectUserEmail = createSelector(
  selectAuthState,
  ({ user }: AuthState) => user?.email ?? null,
);
export const selectIsLoggingIn = createSelector(
  selectAuthState,
  ({ isLoggingIn }: AuthState) => isLoggingIn,
);

export const selectLoginError = createSelector(
  selectAuthState,
  ({ loginError }: AuthState) => loginError,
);
export const selectIsRequestingPasswordReset = createSelector(
  selectAuthState,
  ({ isRequestingPasswordReset }: AuthState) => isRequestingPasswordReset,
);

export const selectPasswordResetError = createSelector(
  selectAuthState,
  ({ passwordResetError }: AuthState) => passwordResetError,
);

export const selectIsResettingPassword = createSelector(
  selectAuthState,
  ({ isResettingPassword }: AuthState) => isResettingPassword,
);

export const selectResetPasswordError = createSelector(
  selectAuthState,
  ({ resetPasswordError }: AuthState) => resetPasswordError,
);

export const selectResetPasswordSuccess = createSelector(
  selectAuthState,
  ({ resetPasswordSuccess }: AuthState) => resetPasswordSuccess,
);

export const selectIsLoggingOut = createSelector(
  selectAuthState,
  ({ isLoggingOut }: AuthState) => isLoggingOut,
);

export const selectIsAuthCheckComplete = createSelector(
  selectAuthState,
  ({ isAuthCheckComplete }: AuthState) => isAuthCheckComplete,
);
