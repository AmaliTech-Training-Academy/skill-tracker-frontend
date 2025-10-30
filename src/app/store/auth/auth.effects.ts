import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService, ErrorHandlerService, APP_CONSTANTS, UserState } from '@app/core';
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
} from './auth.actions';

const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
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
          map(({ data }) => loginSuccess({ user: data })),
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

  public loginOrVerifySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess, verifyEmailOtpSuccess),
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

  public registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerUserSuccess),
        tap(() => {
          this.router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
        }),
      ),
    { dispatch: false },
  );

  public logoutOrAuthFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess, loginFailure),
        tap(() => {
          this.router.navigateByUrl(APP_ROUTES.LOGIN);
        }),
      ),
    { dispatch: false },
  );
}
