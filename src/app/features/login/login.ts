import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { InputFieldComponent } from '@app/shared';
import { getFormControl } from '@app/shared';
import * as AuthActions from '@app/store/auth/auth.actions';
import { selectIsLoggingIn } from '@app/store/auth/auth.selectors';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnDestroy {
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  public loading = signal(false);

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {}

  private loginSubscription = this.store
    .select(selectIsLoggingIn)
    .pipe(takeUntil(this.destroy$))
    .subscribe((isLogging) => {
      this.loading.set(isLogging);
    });

  public getFormControl = getFormControl;

  public login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    const request = this.loginForm.value;
    this.store.dispatch(AuthActions.login({ request }));
  }

  public signInWithGoogle() {
    this.store.dispatch(AuthActions.socialLogin({ provider: 'google' }));
  }

  public signInWithGithub() {
    this.store.dispatch(AuthActions.socialLogin({ provider: 'github' }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
