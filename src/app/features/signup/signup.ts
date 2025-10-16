import { CommonModule } from '@angular/common';
import { Component, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, delay, Subscription } from 'rxjs';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { Toast } from 'src/app/shared/compomonents/toast/toast';
import { ToastConfig } from 'src/app/core/models/toast-model';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, Toast],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit, OnDestroy {
  signupForm!: FormGroup;

  // UI state signals
  isSubmitting = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  showToast = signal(false);
  toastExiting = signal(false);

  toastConfig: ToastConfig = {
    type: 'success',
    title: 'Account Created',
    message: "Hurray, Your account is created! We've sent a 6 digit code to your email",
  };

  // Signal to track password value for reactivity
  passwordValue = signal('');
  private passwordSubscription?: Subscription;

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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
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

    // Subscribe to password changes to update signal
    this.passwordSubscription = this.signupForm.get('password')?.valueChanges.subscribe((value) => {
      this.passwordValue.set(value || '');
    });
  }

  // Authentication methods
  async onSubmit() {
    // Mark all controls as touched to show errors if invalid
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      console.error('Form is invalid. Cannot submit.');
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.signupForm.value;

    // Simulate an API call
    of(true)
      .pipe(delay(2000))
      .subscribe({
        next: () => {
          this.showToast.set(true);
          // Show for 3 seconds before starting exit
          setTimeout(() => {
            this.toastExiting.set(true);
            setTimeout(() => {
              this.showToast.set(false);
              this.toastExiting.set(false);
            }, 300);
          }, 4000);
        },
        error: (err) => {
          this.toastConfig = {
            type: 'error',
            title: 'Signup Failed',
            message: 'Unable to create your account. Please try again.',
          };
          this.showToast.set(true);
          setTimeout(() => {
            this.toastExiting.set(true);
            setTimeout(() => {
              this.showToast.set(false);
              this.toastExiting.set(false);
            }, 300);
          }, 4000);
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  signInWithGoogle() {
    console.log('Initiating Google Sign-in...');
    // Implement Google Auth logic here
  }

  signInWithGithub() {
    console.log('Initiating GitHub Sign-in...');
    // Implement GitHub Auth logic here
  }

  onToastClose() {
    this.toastExiting.set(true);
    setTimeout(() => {
      this.showToast.set(false);
      this.toastExiting.set(false);
    }, 300);
  }

  ngOnDestroy() {
    this.passwordSubscription?.unsubscribe();
  }
}
