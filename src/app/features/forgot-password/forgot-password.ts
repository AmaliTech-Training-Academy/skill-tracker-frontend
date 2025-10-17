import { Component, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
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
export class ForgotPassword implements OnDestroy {
  loading = false;
  forgotPasswordForm: FormGroup;

  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly forgotPasswordService = inject(ForgotPasswordService);

  constructor() {
    this.forgotPasswordForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getControl(controlName: string): FormControl {
    return this.forgotPasswordForm.get(controlName) as FormControl;
  }

  login(): void {
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
            'A link to reset your password has been sent to your email.',
          );
          this.loading = false;
        },
        error: () => {
          this.toastService.showError('Error', 'This email does not exist in our records.');
          this.loading = false;
        },
      });
  }

  trydifferentemail(): void {
    this.getControl('email').reset('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
