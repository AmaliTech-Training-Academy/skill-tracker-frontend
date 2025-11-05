import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import {
  AuthService,
  ErrorHandlerService,
  APP_CONSTANTS,
  UserState,
  ToastService,
  LoginSuccessResponse,
} from '@app/core';
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
} from './auth.actions';

const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  public registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      switchMap(({ request }) =>
        this.authService.register(request).pipe(
          map(({ data }) => registerUserSuccess({ user: data })),
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
          map(({ data }) => verifyEmailOtpSuccess({ user: data })),
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
        this.authService.completeOnboarding(request).pipe(
          map(({ data }) => completeOnboardingSuccess({ user: data })),
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
          map(({ success, message, data, metadata }: LoginSuccessResponse) =>
            loginSuccess({ user: data, message, metadata, success }),
          ),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(loginFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public loginSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          this.toastService.showSuccess(
            'Login Successful',
            'Logged in successfully! Redirecting you to your dashboard...',
          );
        }),
      ),
    { dispatch: false },
  );

  public loginFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Login Failed',
            error?.message ?? 'Incorrect email or password.',
          );
        }),
      ),
    { dispatch: false },
  );

  public loginOrVerifySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess, verifyEmailOtpSuccess),
        tap((action) => {
          if ('user' in action) {
            const user = action.user;
            if (!user) return;

            if (user.state === UserState.ACTIVE) {
              this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
            } else if (user.state === UserState.REGISTERED) {
              this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
            } else {
              this.router.navigateByUrl(APP_ROUTES.LOGIN);
            }
          } else if ('message' in action) {
            this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
          }
        }),
      ),
    { dispatch: false },
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

  public onboardingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(completeOnboardingSuccess),
        tap(() => this.router.navigateByUrl(APP_ROUTES.DASHBOARD)),
      ),
    { dispatch: false },
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

  public registerFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerUserFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Signup Failed',
            error.message || 'Unable to create your account. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );

  public logoutOrAuthFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess, loginFailure),
        tap(() => this.router.navigateByUrl(APP_ROUTES.LOGIN)),
      ),
    { dispatch: false },
  );

  public socialLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(socialLogin),
        tap(({ provider }) => this.authService.initiateSocialLogin(provider)),
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
          if (user.state === UserState.ACTIVE) {
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
            error.message || 'Unable to login with social provider. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );
}
