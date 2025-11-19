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
import { selectResetToken } from '@app/store/auth/auth.selectors';

import { ToastService } from '@app/core';

import { InputFieldComponent } from '../../shared/input-field/input-field';
import { getFormControl } from '@app/shared';

import * as AuthActions from '@app/store/auth/auth.actions';
import {
  selectIsResettingPassword,
  selectResetPasswordError,
  selectResetPasswordSuccess,
} from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit, OnDestroy {
  public isSubmitting = this.store.selectSignal(selectIsResettingPassword);
  public resetError = this.store.selectSignal(selectResetPasswordError);
  public resetSuccess = this.store.selectSignal(selectResetPasswordSuccess);

  public passwordValue = signal('');
  public resetTokenSignal = this.store.selectSignal(selectResetToken);

  private resetToken: string | null = null;
  private destroy$ = new Subject<void>();

  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private toastService: ToastService,
  ) {}

  public ngOnInit(): void {
    
    this.resetToken = this.route.snapshot.queryParamMap.get('token');

    if (!this.resetToken) {
      this.toastService.showError(
        APP_CONSTANTS.APP_ERRORS.RESET_TOKEN.TITLE,
        APP_CONSTANTS.APP_ERRORS.RESET_TOKEN.MESSAGE
      );
      this.router.navigateByUrl(APP_CONSTANTS.APP_ROUTES.FORGOT_PASSWORD);
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

    
    passwordControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.passwordValue.set(value || '');
      this.checkMismatch();
    });

    confirmPasswordControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.checkMismatch();
    });
  }

  public get hasPasswordMismatch(): boolean {
  return !!(
    this.newPasswordControl?.hasError('passwordMismatch') &&
    (this.newPasswordControl?.touched || this.newPasswordControl?.dirty)
  );
}

  private checkMismatch(): void {
    const passwordControl = this.loginForm.get('password') as FormControl;
    const confirmPasswordControl = this.loginForm.get('confirmPassword') as FormControl;

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

  public getFormControl = getFormControl;
}