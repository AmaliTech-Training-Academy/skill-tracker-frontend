import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, pipe, delay } from 'rxjs';

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

  // Inject FormBuilder and initialize the form
  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]],
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
