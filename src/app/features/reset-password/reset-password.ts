import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ResetPasswordService } from './reset-password.service';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    HttpClientModule,
    FontAwesomeModule,
  ],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnDestroy {
  public successMessage = '';
  public errorMessage = '';
  public loading = false;
  public loginForm!: FormGroup;
  private subscription?: Subscription;

  public hasUppercase = false;
  public hasLowercase = false;
  public hasNumber = false;
  public hasSpecialChar = false;

  public faCheck = faCheck;
  public faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private library: FaIconLibrary,
  ) {
    this.library.addIcons(faCheck, faTimes);

    this.loginForm = this.fb.group({
      password1: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[A-Z])/),
          Validators.pattern(/(?=.*[a-z])/),
          Validators.pattern(/(?=.*[0-9])/),
          Validators.pattern(/(?=.*[!@#$%^&*])/),
        ],
      ],
      password2: ['', [Validators.required]],
    });

    this.password1Control.valueChanges.subscribe((value: string) => {
      this.updatePasswordIndicators(value);
    });
  }

  public get password1Control(): FormControl {
    return this.loginForm.get('password1') as FormControl;
  }

  public get password2Control(): FormControl {
    return this.loginForm.get('password2') as FormControl;
  }

  private updatePasswordIndicators(value: string): void {
    this.hasUppercase = /[A-Z]/.test(value);
    this.hasLowercase = /[a-z]/.test(value);
    this.hasNumber = /[0-9]/.test(value);
    this.hasSpecialChar = /[!@#$%^&*]/.test(value);
  }

  public resetpassword(): void {
    if (this.loginForm.invalid) return;

    const { password1, password2 } = this.loginForm.value;

    if (password1 !== password2) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      resetToken: 'unique-secure-token-from-email',
      newPassword: password1,
    };

    this.subscription = this.resetPasswordService.resetPassword(payload).subscribe({
      next: (message) => {
        this.successMessage = message;
        this.loading = false;
        this.loginForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Password reset failed.';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
