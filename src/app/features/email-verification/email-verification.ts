import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/core';
import { takeUntil, Subject, of, delay } from 'rxjs';
import { DatePipe } from '@angular/common';
import { goToSignUp } from '@app/shared/utils/navigation';

@Component({
  selector: 'app-email-verification',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerification implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastService: ToastService = inject(ToastService);

  private readonly DELAY_MS = 2000;
  private readonly VERIFICATION_TIME_SEC = 30;
  private readonly INTERVAL_MS = 1000;

  public isSubmitting = signal(false);
  public formValid = signal(false);
  public timeLeft = signal(this.VERIFICATION_TIME_SEC);
  public canResend = signal(false);

  private destroy$ = new Subject<void>();

  @ViewChildren('otpInput') private otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  public otpFields = Array.from({ length: 6 }, (_, i) => ({ name: `otp${i}`, index: i }));

  public otpForm!: FormGroup;

  ngOnInit() {
    const controls: Record<string, FormControl> = {};
    this.otpFields.forEach((field) => {
      controls[field.name] = new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]);
    });
    this.otpForm = this.fb.group(controls);

    this.otpForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formValid.set(this.otpForm.valid);
    });
    this.startTimer();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public startTimer() {
    this.timeLeft.set(30);
    this.canResend.set(false);

    const countdown = setInterval(() => {
      const current = this.timeLeft();
      if (current > 0) {
        this.timeLeft.set(current - 1);
      } else {
        this.canResend.set(true);
        clearInterval(countdown);
      }
    }, this.INTERVAL_MS);
  }

  public resendCode() {
    this.toastService.showInfo('Code Sent', 'A new verification code has been sent to your email.');
    this.startTimer();
  }

  public onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^[0-9]$/.test(value) && value !== '') {
      input.value = '';
      return;
    }

    if (value && index < this.otpFields.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      nextInput?.nativeElement.focus();
    }
  }

  public onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      prevInput?.nativeElement.focus();
    }
  }

  public onSubmit() {
    this.otpForm.markAllAsTouched();

    if (this.otpForm.invalid) return;

    this.isSubmitting.set(true);

    // Simulate an API call
    of(true)
      .pipe(delay(this.DELAY_MS), takeUntil(this.destroy$))
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

  public goToSignUp() {
    goToSignUp(this.router);
  }
}
