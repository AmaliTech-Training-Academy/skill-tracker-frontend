import { Component, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { Subject } from 'rxjs';
// import { LoginService } from './login.service';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ToastService } from 'src/app/core/services/toast/toast-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword implements OnDestroy {
  loading = false;
  loginForm: FormGroup;

  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  // private readonly loginService = inject(LoginService);
  private readonly toastService = inject(ToastService);

  constructor() {
    this.loginForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getControl(controlName: string): FormControl {
    return this.loginForm.get(controlName) as FormControl;
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // const email  = this.loginForm.value.email;

    // this.loginService
    //   .login(email, password)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: () => {
    //       this.toastService.showSuccess(
    //         'Login Successful',
    //         'Logged in successfully! Redirecting you to your dashboard...',
    //       );
    //       this.loading = false;
    //     },
    //     error: () => {
    //       this.toastService.showError('Login Failed', 'Incorrect email or password.');
    //       this.loading = false;
    //     },
    //   });
  }

  public trydifferentemail(): void {
    this.getControl('email').setValue(' ');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
