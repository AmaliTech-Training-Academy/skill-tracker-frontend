import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ToastService } from '@app/core';
import { ForgotPasswordService } from './forgot-password.service';
import { getFormControl } from '@app/shared';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword implements OnInit, OnDestroy {
  public forgotPasswordForm!: FormGroup;
  public loading = false;
  private readonly destroy$ = new Subject<void>();
  
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly forgotPasswordService = inject(ForgotPasswordService);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public getControl = getFormControl;

  public submit(): void {
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

  public tryDifferentEmail(): void {
    this.getControl(this.forgotPasswordForm,'email').reset('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
