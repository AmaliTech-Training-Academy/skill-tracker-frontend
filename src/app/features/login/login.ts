import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, filter, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ToastService, LoginRequest, AppError } from '@app/core';
import { getFormControl } from '@app/shared';
import * as AuthActions from '@app/store/auth/auth.actions';
import * as AuthSelectors from '@app/store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputFieldComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly toastService = inject(ToastService);

  getFormControl = getFormControl;

  // NgRx Signals
  public isLoggingIn: Signal<boolean>;
  public loginError: Signal<AppError | null>;
  public loginSuccess$: any;

  constructor() {
    this.isLoggingIn = this.store.selectSignal(AuthSelectors.selectIsLoggingIn as any);
    this.loginError = this.store.selectSignal(AuthSelectors.selectLoginError as any);
    this.loginSuccess$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    // Show toast on success
    this.loginSuccess$
      .pipe(
        filter((success) => success === true),
        takeUntil(this.destroy$),
        tap(() => {
          this.toastService.showSuccess(
            'Login Successful',
            'Logged in successfully! Redirecting you to your dashboard...',
          );
        }),
      )
      .subscribe();

    // Subscribe to loginError signal for showing toast
    this.store.select(AuthSelectors.selectLoginError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => !!error),
        tap((error: AppError) => {
          this.toastService.showError(
            'Login Failed',
            error?.message ?? 'Incorrect email or password.'
          );
        })
      )
      .subscribe();
  }

  login(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const request: LoginRequest = {
      email: email!,
      password: password!,
    };

    this.store.dispatch(AuthActions.login({ request }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
