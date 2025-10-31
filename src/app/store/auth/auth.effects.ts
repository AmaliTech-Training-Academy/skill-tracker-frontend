import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import {
  AuthService,
  ErrorHandlerService,
  APP_CONSTANTS,
  UserState,
  ToastService,
} from '@app/core';
import { HttpErrorResponse } from '@angular/common/http';

const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private errorHandlerService = inject(ErrorHandlerService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      switchMap(
        ({ request }) =>
          this.authService.register(request).pipe(
            map((response) => {
              return AuthActions.registerUserSuccess({ user: response.data });
            }),
            catchError((httpError: HttpErrorResponse) => {
              const appError = this.errorHandlerService.getError(httpError);
              return of(AuthActions.registerUserFailure({ error: appError }));
            }),
          ) as Observable<Action>,
      ),
    ),
  );

  public verifyEmailOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyEmailOtp),
      switchMap(
        ({ request }) =>
          this.authService.verifyEmail(request).pipe(
            map((response) => AuthActions.verifyEmailOtpSuccess({ 
              user: response.data, 
              message: response.message 
            })),
            catchError((httpError: HttpErrorResponse) => {
              const appError = this.errorHandlerService.getError(httpError);
              return of(AuthActions.verifyEmailOtpFailure({ error: appError }));
            }),
          ) as Observable<Action>,
      ),
    ),
  );

  public completeOnboarding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.completeOnboarding),
      switchMap(
        ({ request }) =>
          this.authService.completeOnboarding(request).pipe(
            map((response) => {
              this.toastService.showSuccess(
                'Onboarding Complete',
                response?.message || 'Welcome! Your profile has been set up successfully.',
              );
              return AuthActions.completeOnboardingSuccess({ user: response.data });
            }),
            catchError((httpError: HttpErrorResponse) => {
              const appError = this.errorHandlerService.getError(httpError);
              return of(AuthActions.completeOnboardingFailure({ error: appError }));
            }),
          ) as Observable<Action>,
      ),
    ),
  );

  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(
        ({ request }) =>
          this.authService.login(request).pipe(
            map((response) => AuthActions.loginSuccess({ user: response.data })),
            catchError((httpError: HttpErrorResponse) => {
              const appError = this.errorHandlerService.getError(httpError);
              return of(AuthActions.loginFailure({ error: appError }));
            }),
          ) as Observable<Action>,
      ),
    ),
  );

  public logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(
        () =>
          this.authService.logout().pipe(
            map(() => AuthActions.logoutSuccess()),
            catchError((httpError: HttpErrorResponse) => {
              const appError = this.errorHandlerService.getError(httpError);
              return of(AuthActions.logoutFailure({ error: appError }));
            }),
          ) as Observable<Action>,
      ),
    ),
  );

  public loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          if (user.state === UserState.ACTIVE) {
            this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
          } else {
            this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
          }
        }),
      ),
    { dispatch: false },
  );

  public verifyEmailSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.verifyEmailOtpSuccess),
        tap(({ user, message }) => {
          this.toastService.showSuccess(
            'Email Verified',
            message || 'Your email has been successfully verified!',
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

  public registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerUserSuccess),
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

  public onboardingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.completeOnboardingSuccess),
        tap(() => {
          this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
        }),
      ),
    { dispatch: false },
  );

  public registerFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerUserFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Signup Failed',
            error?.message || 'Unable to create your account. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );

  public verifyEmailFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.verifyEmailOtpFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Verification Failed',
            error?.message || 'Invalid verification code. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );

  public socialLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.socialLogin),
        tap(({ provider }) => {
          this.authService.initiateSocialLogin(provider);
        }),
      ),
    { dispatch: false },
  );

  public socialLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.socialLoginSuccess),
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
        ofType(AuthActions.socialLoginFailure),
        tap(({ error }) => {
          this.toastService.showError(
            'Social Login Failed',
            error?.message || 'Unable to login with social provider. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );

  public logoutOrAuthFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess, AuthActions.loginFailure),
        tap(() => {
          this.router.navigateByUrl(APP_ROUTES.LOGIN);
        }),
      ),
    { dispatch: false },
  );
}
