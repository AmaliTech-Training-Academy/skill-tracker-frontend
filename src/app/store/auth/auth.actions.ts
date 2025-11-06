import { createAction, props } from '@ngrx/store';
import {
  RegisterRequest,
  User,
  AppError,
  VerifyEmailRequest,
  UpdateUserStateRequest,
  LoginRequest,
} from '@app/core';

export const registerUser = createAction(
  '[Auth/Registration] Register User',
  props<{ request: RegisterRequest }>(),
);

export const registerUserSuccess = createAction(
  '[Auth/Registration] Register User Success',
  props<{ user: User }>(),
);

export const registerUserFailure = createAction(
  '[Auth/Registration] Register User Failure',
  props<{ error: AppError }>(),
);

export const login = createAction('[Auth/Login] Login', props<{ request: LoginRequest }>());

export const loginSuccess = createAction('[Auth/Login] Login Success', props<{ user: User }>());

export const loginFailure = createAction(
  '[Auth/Login] Login Failure',
  props<{ error: AppError }>(),
);

export const logout = createAction('[Auth/Logout] Logout');

export const logoutSuccess = createAction('[Auth/Logout] Logout Success');

export const logoutFailure = createAction(
  '[Auth/Logout] Logout Failure',
  props<{ error: AppError }>(),
);

export const verifyEmailOtp = createAction(
  '[Auth/Verification] Verify Email OTP',
  props<{ request: VerifyEmailRequest }>(),
);

export const verifyEmailOtpSuccess = createAction(
  '[Auth/Verification] Verify Email OTP Success',
  props<{ user: User; message: string }>(),
);

export const verifyEmailOtpFailure = createAction(
  '[Auth/Verification] Verify Email OTP Failure',
  props<{ error: AppError }>(),
);

export const completeOnboarding = createAction(
  '[Onboarding] Complete Onboarding',
  props<{ request: UpdateUserStateRequest }>(),
);

export const completeOnboardingSuccess = createAction(
  '[Onboarding] Complete Onboarding Success',
  props<{ user: User }>(),
);

export const completeOnboardingFailure = createAction(
  '[Onboarding] Complete Onboarding Failure',
  props<{ error: AppError }>(),
);

export const socialLogin = createAction(
  '[Auth/Social] Social Login',
  props<{ provider: string }>(),
);

export const socialLoginSuccess = createAction(
  '[Auth/Social] Social Login Success',
  props<{ user: User; message?: string }>(),
);

export const socialLoginFailure = createAction(
  '[Auth/Social] Social Login Failure',
  props<{ error: AppError }>(),
);

export const resendVerification = createAction(
  '[Auth/Verification] Resend Verification',
  props<{ email: string }>(),
);

export const resendVerificationSuccess = createAction(
  '[Auth/Verification] Resend Verification Success',
  props<{ message: string }>(),
);

export const resendVerificationFailure = createAction(
  '[Auth/Verification] Resend Verification Failure',
  props<{ error: AppError }>(),
);

export const updateTourStatus = createAction('[Auth/Tour] Update Tour Status');

export const updateTourStatusSuccess = createAction(
  '[Auth/Tour] Update Tour Status Success',
  props<{ user: User }>(),
);

export const updateTourStatusFailure = createAction(
  '[Auth/Tour] Update Tour Status Failure',
  props<{ error: AppError }>(),
);
