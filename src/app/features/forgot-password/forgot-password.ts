import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
export class ForgotPassword implements OnInit, OnDestroy {
  loading = false;
  forgotPasswordForm: FormGroup = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private toastService: ToastService,
    private forgotPasswordService: ForgotPasswordService
  ) {}

  ngOnInit(): void {}

  getControl(controlName: string): FormControl {
    return this.forgotPasswordForm.get(controlName) as FormControl;
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
