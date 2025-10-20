import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast-service';
import { takeUntil, Subject, of, delay } from 'rxjs';

@Component({
  selector: 'app-email-verification',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerification implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastService = inject(ToastService);
  isSubmitting = signal(false);
  formValid = signal(false);
  private destroy$ = new Subject<void>();

  // Reactive form for OTP inputs
  otpForm: FormGroup = this.fb.group({
    otp1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    otp2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    otp3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    otp4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    otp5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    otp6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
  });

  ngOnInit() {
    this.otpForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formValid.set(this.otpForm.valid);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(event: Event, nextInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^[0-9]$/.test(value) && value !== '') {
      input.value = '';
      return;
    }

    if (value && nextInput) {
      nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, prevInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && prevInput) {
      prevInput.focus();
    }
  }

  getOtpCode(): string {
    return Object.values(this.otpForm.value).join('');
  }

  // Authentication methods
  async onSubmit() {
    this.otpForm.markAllAsTouched();

    if (this.otpForm.invalid) return;

    this.isSubmitting.set(true);

    // Simulate an API call
    of(true)
      .pipe(delay(2000), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess(
            'Email Verified',
            'Your email is verified. We’ll redirect you to your dashboard',
          );
          this.router.navigateByUrl('/login');
        },
        error: () => {
          this.toastService.showError(
            'Verification Failed',
            'Unable to verify email. Please try again.',
          );
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
