import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPassword implements OnDestroy {
  public successMessage = '';
  public errorMessage = '';
  public loading = false;
  public loginForm!: FormGroup;

  private subscription?: Subscription;

  // password strength indicators
  public hasUppercase = false;
  public hasLowercase = false;
  public hasNumber = false;
  public hasSpecialChar = false;

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
  ) {
    this.loginForm = this.fb.group({
      password1: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[A-Z])/), // Uppercase
          Validators.pattern(/(?=.*[a-z])/), // Lowercase
          Validators.pattern(/(?=.*[0-9])/), // Number
          Validators.pattern(/(?=.*[!@#$%^&*])/), // Special char
        ],
      ],
      password2: ['', [Validators.required]],
    });

    // Watch password input for indicators
    this.password1Control.valueChanges.subscribe((value: string) => {
      this.updatePasswordIndicators(value);
    });
  }

  get password1Control(): FormControl {
    return this.loginForm.get('password1') as FormControl;
  }

  get password2Control(): FormControl {
    return this.loginForm.get('password2') as FormControl;
  }

  private updatePasswordIndicators(value: string): void {
    this.hasUppercase = /[A-Z]/.test(value);
    this.hasLowercase = /[a-z]/.test(value);
    this.hasNumber = /[0-9]/.test(value);
    this.hasSpecialChar = /[!@#$%^&*]/.test(value);
  }

  resetpassword() {
    if (this.loginForm.invalid) return;

    const { password1, password2 } = this.loginForm.value;

    if (password1 !== password2) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.subscription = this.resetPasswordService.resetPassword(password1).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
