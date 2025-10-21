import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  computed,
  OnDestroy,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, delay, Subject, takeUntil } from 'rxjs';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ToastService } from 'src/app/core/services/toast/toast-service';
import { InputFieldComponent } from 'src/app/shared/input-field/input-field';
import { getFormControl } from 'src/app/shared/utils/form-utils';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup implements OnInit, OnDestroy {
  isSubmitting = signal(false);

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  router = inject(Router);

  passwordValue = signal('');
  private destroy$ = new Subject<void>();
  private readonly SIGNUP_DELAY_MS = 2000;

  signupForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.hasUppercase,
          CustomValidators.hasLowercase,
          CustomValidators.hasNumber,
          CustomValidators.hasSpecialChar,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]],
    },
    { validators: CustomValidators.passwordMatchValidator },
  );

  // Computed signal for password requirements
  passwordRequirements = computed(() => {
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

  ngOnInit() {
    // Subscribe to password changes to update signal
    this.getFormControl(this.signupForm, 'password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.passwordValue.set(value || '');
      });
  }

  signInWithGoogle() {
    // Implement Google Auth logic here
  }

  signInWithGithub() {
    // Implement GitHub Auth logic here
  }

  getFormControl = getFormControl;

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  async onSubmit() {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) return;

    this.isSubmitting.set(true);

    // Simulate an API call
    of(true)
      .pipe(delay(this.SIGNUP_DELAY_MS), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess(
            'Account Created',
            "Hurray, Your account is created! We've sent a 6 digit code to your email",
          );
          this.router.navigateByUrl('/email-verification');
        },
        error: () => {
          this.toastService.showError(
            'Signup Failed',
            'Unable to create your account. Please try again.',
          );
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
