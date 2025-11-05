import { Component, ChangeDetectionStrategy, OnDestroy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { InputFieldComponent } from '../../shared/input-field/input-field';
import { LoginRequest } from '@app/core';
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
export class Login implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {}

  public getFormControl = getFormControl;

  public isLoggingIn: Signal<boolean> = this.store.selectSignal(AuthSelectors.selectIsLoggingIn);

  public loginError = this.store.selectSignal(AuthSelectors.selectLoginError);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public login(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const request: LoginRequest = {
      email: email as string,
      password: password as string,
    };

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
