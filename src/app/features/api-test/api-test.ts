import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, Subject, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ErrorHandlerService,
  AuthService,
  AppError,
  RegisterRequest,
  FormErrorService,
} from '@app/core';

@Component({
  selector: 'app-api-test',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './api-test.html',
  styleUrl: './api-test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiTest implements OnDestroy, OnInit {
  private destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly formErrorService = inject(FormErrorService);
  private readonly router = inject(Router);

  registerForm!: FormGroup;
  isLoading = signal(false);

  private passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    if (!value) return null;

    const errors: ValidationErrors = {};
    const minLength = 8;
    const maxLength = 64;
    const specialCharPattern = /[!@$*%?&]/;

    if (value.length < minLength || value.length > maxLength) {
      errors['length'] = { requiredLength: minLength, actualLength: value.length };
    }
    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }
    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = true;
    }
    if (!/[0-9]/.test(value)) {
      errors['number'] = true;
    }
    if (!specialCharPattern.test(value)) {
      errors['specialChar'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordComplexityValidator]],
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const payload: RegisterRequest = this.registerForm.value;

    this.authService
      .register(payload)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/verify-otp']);
        },
        error: (rawError) => {
          const appError: AppError = this.errorHandler.getError(rawError);
          this.formErrorService.mapApiErrors(this.registerForm, appError);

          this.errorHandler.logError(rawError);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
