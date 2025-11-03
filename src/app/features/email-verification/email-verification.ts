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
import { takeUntil, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { APP_CONSTANTS } from '@app/core';
import * as AuthActions from '@app/store/auth/auth.actions';
import { selectIsVerifying, selectUserEmail } from '@app/store/auth/auth.selectors';

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
  private store = inject(Store);

  private readonly VERIFICATION_TIME_SEC = 30;
  private readonly INTERVAL_MS = 1000;

  public isSubmitting = this.store.selectSignal(selectIsVerifying);
  private userEmail = this.store.selectSignal(selectUserEmail);
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
    const email = this.userEmail();
    if (email) {
      this.store.dispatch(AuthActions.resendVerification({ email }));
      this.startTimer();
    }
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

    const otpCode = this.otpFields.map(field => this.otpForm.get(field.name)?.value).join('');
    
    const email = this.userEmail();
    if (!email) return;
    
    this.store.dispatch(AuthActions.verifyEmailOtp({ request: { code: otpCode, email } }));
  }

  public goToSignUp() {
    this.router.navigateByUrl(APP_CONSTANTS.APP_ROUTES.SIGNUP);
  }
}