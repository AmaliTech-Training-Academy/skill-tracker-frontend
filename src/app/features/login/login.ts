import { Component, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from './login.service';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ToastService } from '@app/core';
import { getFormControl } from '@app/shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputFieldComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnDestroy {
  successMessage = '';
  errorMessage = '';
  loading = false;

  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly toastService = inject(ToastService);

  getFormControl = getFormControl;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.loginService
      .login(email!, password!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess(
            'Login Successful',
            'Logged in successfully! Redirecting you to your dashboard...',
          );
          this.loading = false;
        },
        error: () => {
          this.toastService.showError('Login Failed', 'Incorrect email or password.');
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
