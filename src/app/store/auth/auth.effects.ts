import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '@app/core';


import { AuthService, ErrorHandlerService, APP_CONSTANTS, UserState, ToastService } from '@app/core';
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
  socialLoginSuccess
} from './auth.actions';

const { APP_ROUTES, FULL_PAGE_ROUTES } = APP_CONSTANTS;
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private errorHandlerService = inject(ErrorHandlerService);
  private router = inject(Router);
  private toastService = inject(ToastService)


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
        map((response) =>
          loginSuccess({
            user: { ...(response.data as any) } as User,
            token: null,
          })
        ),
        catchError((httpError: HttpErrorResponse) => {
          const appError = this.errorHandlerService.getError(httpError);
          return of(loginFailure({ error: appError }));
        })
      )
    )
  )
);



public loginOrVerifySuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(loginSuccess, verifyEmailOtpSuccess),
      tap(({ user }) => {
        console.log('Login success effect triggered with user:', user);
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
            error?.message || 'Unable to create your account. Please try again.',
          );
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
            error?.message || 'Unable to login with social provider. Please try again.',
          );
        }),
      ),
    { dispatch: false },
  );
}
