import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService, ErrorHandlerService, AppError, FormErrorService } from '@app/core';

@Component({
  selector: 'app-otp-test',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './otp-test.html',
  styleUrl: './otp-test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpTest implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly formErrorService = inject(FormErrorService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  otpForm!: FormGroup;
  isLoading = signal(false);
  generalError = signal<string | null>(null);

  readonly sessionId = this.authService.registrationSessionId();

  ngOnInit(): void {
    if (!this.sessionId) {
      this.router.navigate(['/register']);
      return;
    }

    this.otpForm = this.fb.nonNullable.group({
      otp: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }

  get otp() {
    return this.otpForm.get('otp');
  }

  onSubmit(): void {
    this.generalError.set(null);

    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    if (!this.sessionId) {
      this.generalError.set('Verification session expired. Please re-register.');
      return;
    }

    this.isLoading.set(true);
    const otpCode: string = this.otpForm.value.otp;

    this.authService
      .verifyOtp(this.sessionId, otpCode)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        error: (rawError) => {
          const appError: AppError = this.errorHandler.getError(rawError);

          const wasFieldMapped = this.formErrorService.mapApiErrors(this.otpForm, appError);

          if (!wasFieldMapped && (appError.status === 400 || appError.status === 404)) {
            console.log('testing', appError.message);
            this.generalError.set(appError.message);

            this.cdr.detectChanges();
          }

          this.errorHandler.logError(rawError);
        },
      });
  }
}
