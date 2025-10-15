import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, pipe, delay } from 'rxjs';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupForm: FormGroup;

  // UI state signals
  isSubmitting = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // Signal to track password value for reactivity
  passwordValue = signal('');

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

  // Inject FormBuilder and initialize the form
  constructor(private fb: FormBuilder) {
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
    this.signupForm.get('password')?.valueChanges.subscribe((value) => {
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
          console.log('Account created successfully!', formValue);
          // Navigate to dashboard or show success message
        },
        error: (err) => {
          console.error('Sign up failed:', err);
          // Show error message in the UI
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
}
