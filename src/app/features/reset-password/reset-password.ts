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
      currentPassword: [
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
      newPassword: ['', [Validators.required]],
    });

    this.currentPasswordControl.valueChanges.subscribe((value: string) => {
      this.updatePasswordIndicators(value);
    });
  }

  public get currentPasswordControl(): FormControl {
    return this.loginForm.get('currentPassword') as FormControl;
  }

  public get newPasswordControl(): FormControl {
    return this.loginForm.get('newPassword') as FormControl;
  }

  private updatePasswordIndicators(value: string): void {
    this.hasUppercase = /[A-Z]/.test(value);
    this.hasLowercase = /[a-z]/.test(value);
    this.hasNumber = /[0-9]/.test(value);
    this.hasSpecialChar = /[!@#$%^&*]/.test(value);
  }

  public resetpassword(): void {
    if (this.loginForm.invalid) return;

    const { currentPassword, newPassword } = this.loginForm.value;

    if (currentPassword !== newPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      resetToken: 'unique-secure-token-from-email',
      newPassword: currentPassword,
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
