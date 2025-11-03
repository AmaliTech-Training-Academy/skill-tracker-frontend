import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputFieldComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnDestroy {
  public successMessage = '';
  public errorMessage = '';
  public loading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly loginService: LoginService,
    private readonly toastService: ToastService,
  ) {}

  public getFormControl = getFormControl;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public login(): void {
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
