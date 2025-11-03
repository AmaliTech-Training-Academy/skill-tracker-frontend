import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthService, ErrorHandlerService, APP_CONSTANTS, UserState } from '@app/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '@app/core';
const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private errorHandlerService = inject(ErrorHandlerService);
  private router = inject(Router);

  public registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      switchMap(
        ({ request }) =>
          this.authService.register(request).pipe(
            map((response) => AuthActions.registerUserSuccess({ user: response.data })),
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
            map((response) => AuthActions.verifyEmailOtpSuccess({ user: response.data })),
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
            map((response) => AuthActions.completeOnboardingSuccess({ user: response.data })),
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
    switchMap(({ request }) =>
      this.authService.login(request).pipe(
        map((response) =>
        AuthActions.loginSuccess({
        user: response.data as unknown as User,
         token: null,
        }),
     ),
        catchError((httpError: HttpErrorResponse) => {
          const appError = this.errorHandlerService.getError(httpError);
          return of(AuthActions.loginFailure({ error: appError }));
        }),
      ) as Observable<Action>,
    ),
  ),
);




public loginOrVerifySuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.verifyEmailOtpSuccess),
      tap(({ user }) => {
        console.log('Login success effect triggered with user:', user); // ✅ Add this
        if (!user) return;

        if (user.state === UserState.ACTIVE) {
          this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
        } else if (user.state === UserState.REGISTERED) {
          this.router.navigateByUrl(FULL_PAGE_ROUTES.INTEREST_SELECTION);
        } else {
          this.router.navigateByUrl(APP_ROUTES.LOGIN);
        }
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

  public registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerUserSuccess),
        tap(() => {
          this.router.navigateByUrl(APP_ROUTES.EMAIL_VERIFICATION);
        }),
      ),
    { dispatch: false },
  );

  public forgotPassword$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.forgotPassword),
    switchMap(({ email }) =>
      this.authService.forgotPassword(email).pipe(
        map(() => AuthActions.forgotPasswordSuccess()),
        catchError((httpError: HttpErrorResponse) => {
          const appError = this.errorHandlerService.getError(httpError);
          return of(AuthActions.forgotPasswordFailure({ error: appError }));
        }),
      ),
    ),
  ),
);

 public resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      switchMap(({ resetToken, newPassword }) =>
        this.authService.resetPassword({ resetToken, newPassword }).pipe(
          map(() => AuthActions.resetPasswordSuccess()),
          catchError((httpError: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(httpError);
            return of(AuthActions.resetPasswordFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(() => {
          this.router.navigateByUrl(APP_ROUTES.LOGIN);
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
