import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  computed,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { CustomValidators } from '@app/shared';
import { InputFieldComponent } from '@app/shared';
import { getFormControl } from '@app/shared';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';
import * as AuthActions from '@app/store/auth/auth.actions';
import { selectIsRegistering } from '@app/store/auth/auth.selectors';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {}

  public isSubmitting = this.store.selectSignal(selectIsRegistering);
  public passwordValue = signal('');
  private destroy$ = new Subject<void>();

  public signupForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.hasUppercase,
          CustomValidators.hasLowercase,
          CustomValidators.hasNumber,
          CustomValidators.hasSpecialChar,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: CustomValidators.passwordMatchValidator },
  );

  ngOnInit() {
    this.getFormControl(this.signupForm, 'password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.passwordValue.set(value || '');
      });
  }

  public passwordRequirements = computed(() => {
    const value = this.passwordValue();
    return [
      {
        key: 'hasUppercase',
        message: '1 uppercase letter',
        error: !value || !/[A-Z]/.test(value),
      },
      {
        key: 'hasLowercase',
        message: '1 lowercase letter',
        error: !value || !/[a-z]/.test(value),
      },
      {
        key: 'hasNumber',
        message: '1 number',
        error: !value || !/[0-9]/.test(value),
      },
      {
        key: 'hasSpecialChar',
        message: '1 special character (e.g. ! , @, #, $, %, &, *)',
        error: !value || !/[!@#$%&*]/.test(value),
      },
    ];
  });

  public signInWithGoogle() {
    this.store.dispatch(AuthActions.socialLogin({ provider: 'google' }));
  }

  public signInWithGithub() {
    this.store.dispatch(AuthActions.socialLogin({ provider: 'github' }));
  }

  public getFormControl = getFormControl;

  public goToLogin() {
    this.router.navigateByUrl(APP_CONSTANTS.APP_ROUTES.LOGIN);
  }

  public onSubmit() {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) return;

    const { email, password } = this.signupForm.value;

    this.store.dispatch(AuthActions.registerUser({ request: { email, password } }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
