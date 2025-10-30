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
