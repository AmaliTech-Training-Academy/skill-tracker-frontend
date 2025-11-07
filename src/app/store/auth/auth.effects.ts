import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  AuthService,
  ErrorHandlerService,
  APP_CONSTANTS,
  UserState,
  ToastService,
  mapUserApiResponseToUser,
  AppErrorType,
  UserEmailRequest,
  User,
} from '@app/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  registerUser,
  registerUserSuccess,
  registerUserFailure,
  verifyEmailOtpSuccess,
  verifyEmailOtp,
  verifyEmailOtpFailure,
  completeOnboarding,
  completeOnboardingSuccess,
  completeOnboardingFailure,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  socialLogin,
  socialLoginFailure,
  socialLoginSuccess,
  resendVerification,
  resendVerificationSuccess,
  resendVerificationFailure,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  updateTourStatus,
  updateTourStatusFailure,
  updateTourStatusSuccess,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
} from './auth.actions';
import { selectCurrentUser } from './auth.selectors';
import { AppState } from '../app.state';

const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private toastService: ToastService,
    private store: Store<AppState>,
  ) {}

  public registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      switchMap(({ request }) =>
        this.authService.register(request).pipe(
          map(({ data }) => registerUserSuccess({ user: mapUserApiResponseToUser(data) })),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(registerUserFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public verifyEmailOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyEmailOtp),
      switchMap(({ request }) =>
        this.authService.verifyEmail(request).pipe(
          map(({ data, message }) =>
            verifyEmailOtpSuccess({ user: mapUserApiResponseToUser(data), message }),
          ),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(verifyEmailOtpFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public completeOnboarding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(completeOnboarding),
      switchMap(({ request }) =>
        this.authService.updateUserOnboardedState(request).pipe(
          map(({ data }) => completeOnboardingSuccess({ user: mapUserApiResponseToUser(data) })),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(completeOnboardingFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map(({ data }) => loginSuccess({ user: mapUserApiResponseToUser(data) })),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(loginFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => logoutSuccess()),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(logoutFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public updateTourStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTourStatus),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([_, user]) => {
        if (!user) {
          return of(
            updateTourStatusFailure({
              error: {
                message: 'User not found.',
                type: AppErrorType.AUTH,
              },
            }),
          );
        }

        const request: UserEmailRequest = { email: user.email };

        return this.authService.updateTourStatus(request).pipe(
          map(({ data }) => {
            const updatedUser: User = {
              ...user,
              tourStatus: data.tourStatus,
            };
            return updateTourStatusSuccess({ user: updatedUser });
          }),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(updateTourStatusFailure({ error: appError }));
          }),
        );
      }),
    ),
  );

  public registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerUserSuccess),
        tap(() => {
          this.toastService.showSuccess(
            'Account Created',
            "Hurray, Your account is created! We've sent a 6 digit code to your email",
          );
          this.router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
        }),
      ),
    { dispatch: false },
  );

  public loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ user }) => {
          if (user.state === UserState.ONBOARDED) {
            this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
            return;
          }

          if (user.isVerified) {
            this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
            return;
          }

          this.router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
        }),
      ),
    { dispatch: false },
  );

  public verifyEmailOtpSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(verifyEmailOtpSuccess),
        tap(({ message }) => {
          this.toastService.showSuccess('Email Verified', message);
          this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
        }),
      ),
    { dispatch: false },
  );

  public onboardingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(completeOnboardingSuccess),
        tap(() => {
          this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
        }),
      ),
    { dispatch: false },
  );

  public socialLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(socialLogin),
        tap(({ provider }) => {
          this.authService.initiateSocialLogin(provider);
        }),
      ),
    { dispatch: false },
  );

  public socialLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(socialLoginSuccess),
        tap(({ user, message }) => {
          this.toastService.showSuccess(
            'Login Successful',
            message || 'Successfully logged in with social provider!',
          );
          if (user.isVerified) {
            this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
          } else {
            this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
          }
        }),
      ),
    { dispatch: false },
  );

  public socialLoginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(socialLoginFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Social Login Failed',
            error?.message || 'Unable to login with social provider. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );

  public verifyEmailSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(verifyEmailOtpSuccess),
        tap(() => {
          this.toastService.showSuccess(
            'Email Verified',
            'Your email has been successfully verified!',
          );
        }),
      ),
    { dispatch: false },
  );

  public verifyEmailFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(verifyEmailOtpFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Verification Failed',
            error?.message || 'Invalid verification code. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );

  public loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Login Failed',
            error?.message || 'Invalid email or password. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );

  public resendVerification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resendVerification),
      switchMap(({ email }) =>
        this.authService.resendVerification(email).pipe(
          map(({ message }) => resendVerificationSuccess({ message })),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(resendVerificationFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public resendVerificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resendVerificationSuccess),
        tap(({ message }) => {
          this.toastService.showSuccess(
            'Code Resent',
            message || 'Verification code has been resent to your email.',
          );
        }),
      ),
    { dispatch: false },
  );

  public resendVerificationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resendVerificationFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Resend Failed',
            error?.message || 'Unable to resend verification code. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );
  public resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      switchMap(({ request }) =>
        this.authService.resetPassword(request).pipe(
          map((response) => resetPasswordSuccess({ message: response.message })),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(resetPasswordFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetPasswordSuccess),
        tap(({ message }) => {
          this.toastService.showSuccess(
            'Password Reset',
            message || 'Your password has been successfully reset.',
          );
        }),
        tap(() => this.router.navigateByUrl(APP_ROUTES.LOGIN)),
      ),
    { dispatch: false },
  );

  public forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forgotPassword),
      switchMap(({ request }) =>
        this.authService.forgotPassword(request.email).pipe(
          map((response) =>
            forgotPasswordSuccess({ message: 'Password reset link sent successfully.' }),
          ),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(forgotPasswordFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public forgotPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(forgotPasswordSuccess),
        tap(({ message }) => {
          this.toastService.showSuccess('Success', message);
  public resetPasswordFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetPasswordFailure),
        tap(({ error }) => {
          this.toastService.showError(
            error.type?.charAt(0).toUpperCase() + error.type!.slice(1) + ' Failed',
            error.message,
          );
        }),
      ),
    { dispatch: false },
  );

  public authFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          registerUserFailure,
          loginFailure,
          verifyEmailOtpFailure,
          completeOnboardingFailure,
          logoutFailure,
          socialLoginFailure,
          updateTourStatusFailure,
        ),
        tap(({ error }) => {
          this.toastService.showError(
            error.type?.charAt(0).toUpperCase() + error.type!.slice(1) + ' Failed',
            error.message,
          );
        }),
      ),
    { dispatch: false },
  );
}
