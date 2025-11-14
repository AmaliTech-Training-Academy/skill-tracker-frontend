import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastService } from '@app/core';

import { InputFieldComponent } from '../../shared/input-field/input-field';
import { getFormControl } from '@app/shared';

import * as AuthActions from '@app/store/auth/auth.actions';
import {
  selectIsResettingPassword,
  selectResetPasswordError,
  selectResetPasswordSuccess,
} from '@app/store/auth/auth.selectors';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, FontAwesomeModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit, OnDestroy {
  public isSubmitting = this.store.selectSignal(selectIsResettingPassword);
  public resetError = this.store.selectSignal(selectResetPasswordError);
  public resetSuccess = this.store.selectSignal(selectResetPasswordSuccess);

  public passwordValue = signal('');
  private resetToken: string | null = null;
  private destroy$ = new Subject<void>();

  public loginForm!: FormGroup;

  public faCheck = faCheck;
  public faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private library: FaIconLibrary,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private toastService: ToastService,
  ) {}

  public ngOnInit(): void {
    this.library.addIcons(faCheck, faTimes);

    this.resetToken = this.route.snapshot.queryParamMap.get('token');

    if (!this.resetToken) {
      this.toastService.showError('Reset Error', 'Reset token is missing. Please try again.');
      this.router.navigateByUrl('/forgot-password');
      return;
    }

    this.loginForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[a-z]/),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[!@#$%&*]/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    });

    const passwordControl = this.loginForm.get('password') as FormControl;
    const confirmPasswordControl = this.loginForm.get('confirmPassword') as FormControl;

    const checkMismatch = () => {
      if (passwordControl.value !== confirmPasswordControl.value) {
        if (confirmPasswordControl.dirty || confirmPasswordControl.touched) {
          confirmPasswordControl.setErrors({
            ...(confirmPasswordControl.errors || {}),
            passwordMismatch: true,
          });
        }
      } else if (confirmPasswordControl.hasError('passwordMismatch')) {
        const errors = confirmPasswordControl.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          confirmPasswordControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }
      this.loginForm.updateValueAndValidity({ emitEvent: false });
    };

    passwordControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.passwordValue.set(value || '');
      checkMismatch();
    });

    confirmPasswordControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      checkMismatch();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public passwordRequirements = computed(() => {
    const value = this.passwordValue();
    return [
      {
        key: 'hasUppercase',
        message: '1 uppercase letter',
        error: !value || !/[A-Z]/.test(value),
      },
      {
        key: 'hasLowercase',
        message: '1 lowercase letter',
        error: !value || !/[a-z]/.test(value),
      },
      {
        key: 'hasNumber',
        message: '1 number',
        error: !value || !/[0-9]/.test(value),
      },
      {
        key: 'hasSpecialChar',
        message: '1 special character (e.g. ! , @, #, $, %, &, *)',
        error: !value || !/[!@#$%&*]/.test(value),
      },
    ];
  });

  public get hasUppercase(): boolean {
    return !this.passwordRequirements().find((req) => req.key === 'hasUppercase')?.error;
  }
  public get hasLowercase(): boolean {
    return !this.passwordRequirements().find((req) => req.key === 'hasLowercase')?.error;
  }
  public get hasNumber(): boolean {
    return !this.passwordRequirements().find((req) => req.key === 'hasNumber')?.error;
  }
  public get hasSpecialChar(): boolean {
    return !this.passwordRequirements().find((req) => req.key === 'hasSpecialChar')?.error;
  }

  public onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid || !this.resetToken || this.isSubmitting()) {
      return;
    }

    const { password } = this.loginForm.value;

    const request = {
      token: this.resetToken,
      password: password,
    };

    this.store.dispatch(AuthActions.resetPassword({ request }));
  }

  public resetpassword = this.onSubmit.bind(this);

  public get currentPasswordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  public get newPasswordControl(): FormControl {
    return this.loginForm.get('confirmPassword') as FormControl;
  }

  public get errorMessage(): string | null {
    const error = this.resetError();
    if (error) {
      return error.message;
    }

    if (
      this.newPasswordControl?.hasError('passwordMismatch') &&
      (this.newPasswordControl.touched || this.newPasswordControl.dirty)
    ) {
      return 'Passwords do not match.';
    }

    if (!this.resetToken) {
      return 'A required reset token is missing. Please use the link sent to your email.';
    }

    return null;
  }

  public get successMessage(): string | null {
    return this.resetSuccess() ? 'Password reset successfully! Redirecting to login...' : null;
  }

  public getFormControl = getFormControl;
}
