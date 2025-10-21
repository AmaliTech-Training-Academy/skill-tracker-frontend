import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ToastService } from 'src/app/core/services/toast/toast-service';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword implements OnInit, OnDestroy {
  forgotPasswordForm!: FormGroup;
  loading = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private readonly forgotPasswordService: ForgotPasswordService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getControl(name: string): FormControl {
    return this.forgotPasswordForm.get(name) as FormControl;
  }

  submit(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    const { email } = this.forgotPasswordForm.value;

    this.forgotPasswordService
      .sendResetLink(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess(
            'Check your Inbox',
            'A link to reset your password has been sent to your email.'
          );
          this.loading = false;
        },
        error: () => {
          this.toastService.showError(
            'Error',
            'This email does not exist in our records.'
          );
          this.loading = false;
        },
      });
  }

  tryDifferentEmail(): void {
    this.getControl('email').reset('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
