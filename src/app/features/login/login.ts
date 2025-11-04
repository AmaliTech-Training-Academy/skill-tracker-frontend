import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  Signal,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
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
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private toastService = inject(ToastService);

  public getFormControl = getFormControl;

  public isLoggingIn: Signal<boolean> = this.store.selectSignal(AuthSelectors.selectIsLoggingIn);
  public loginError: Signal<AppError | null> = this.store.selectSignal(
    AuthSelectors.selectLoginError,
  );
  public loginSuccess: Signal<boolean> = this.store.selectSignal(
    AuthSelectors.selectIsAuthenticated,
  );

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    effect(() => {
      if (this.loginSuccess()) {
        this.toastService.showSuccess(
          'Login Successful',
          'Logged in successfully! Redirecting you to your dashboard...',
        );
      }
    });

    effect(() => {
      const error = this.loginError();
      if (error) {
        this.toastService.showError(
          'Login Failed',
          error.message ?? 'Incorrect email or password.',
        );
      }
    });
  }

  public login(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const request: LoginRequest = { email: email!, password: password! };
    this.store.dispatch(AuthActions.login({ request }));
  }

  public signInWithGoogle(): void {
    this.store.dispatch(AuthActions.socialLogin({ provider: 'google' }));
  }

  public signInWithGithub(): void {
    this.store.dispatch(AuthActions.socialLogin({ provider: 'github' }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
