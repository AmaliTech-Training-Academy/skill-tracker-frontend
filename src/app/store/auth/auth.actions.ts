import { createAction, props } from '@ngrx/store';
import {
  RegisterRequest,
  User,
  AppError,
  VerifyEmailRequest,
  UserEmailRequest,
  LoginRequest,
  ResetPasswordRequest,
  CompleteOnboardingRequest,
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
  props<{ error: AppError; silent?: boolean }>(),
);

export const login = createAction('[Auth/Login] Login', props<{ request: LoginRequest }>());

export const loginSuccess = createAction('[Auth/Login] Login Success', props<{ user: User }>());

export const loginFailure = createAction(
  '[Auth/Login] Login Failure',
  props<{ error: AppError; silent?: boolean }>(),
);

export const logout = createAction('[Auth/Logout] Logout');

export const logoutSuccess = createAction('[Auth/Logout] Logout Success');

export const logoutFailure = createAction(
  '[Auth/Logout] Logout Failure',
  props<{ error: AppError; silent?: boolean }>(),
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
  props<{ error: AppError; silent?: boolean }>(),
);

export const completeOnboarding = createAction(
  '[Onboarding] Complete Onboarding',
  props<{ request: CompleteOnboardingRequest }>(),
);

export const completeOnboardingSuccess = createAction(
  '[Onboarding] Complete Onboarding Success',
  props<{ user: User }>(),
);

export const completeOnboardingFailure = createAction(
  '[Onboarding] Complete Onboarding Failure',
  props<{ error: AppError; silent?: boolean }>(),
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
  props<{ error: AppError; silent?: boolean }>(),
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
  props<{ error: AppError; silent?: boolean }>(),
);

export const forgotPassword = createAction(
  '[Auth/Password Reset] Forgot Password',
  props<{ request: UserEmailRequest }>(),
);

export const forgotPasswordSuccess = createAction(
  '[Auth/Password Reset] Forgot Password Success',
  props<{ message: string }>(),
);

export const forgotPasswordFailure = createAction(
  '[Auth/Password Reset] Forgot Password Failure',
  props<{ error: AppError }>(),
);

export const resetPasswordResetState = createAction(
  '[Auth/Password Reset] Reset Password Reset State',
);

export const resetPassword = createAction(
  '[Auth/Password] Reset Password',
  props<{ request: ResetPasswordRequest; silent?: boolean }>(),
);

export const resetPasswordSuccess = createAction(
  '[Auth/Password] Reset Password Success',
  props<{ message: string }>(),
);

export const resetPasswordFailure = createAction(
  '[Auth/Password] Reset Password Failure',
  props<{ error: AppError; silent?: boolean }>(),
);
export const updateTourStatus = createAction('[Auth/Tour] Update Tour Status');

export const updateTourStatusSuccess = createAction(
  '[Auth/Tour] Update Tour Status Success',
  props<{ user: User }>(),
);

export const updateTourStatusFailure = createAction(
  '[Auth/Tour] Update Tour Status Failure',
  props<{ error: AppError; silent?: boolean }>(),
);
