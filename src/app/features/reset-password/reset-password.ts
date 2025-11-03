import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';

// Font Awesome imports
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    FontAwesomeModule,
  ],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPassword implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private resetToken = '';

  // Observables from store
  public loading$ = this.store.select(AuthSelectors.selectIsResettingPassword);
  public error$ = this.store.select(AuthSelectors.selectResetPasswordError);
  public success$ = this.store.select(AuthSelectors.selectResetPasswordSuccess);

  // Password strength indicators
  public hasUppercase = false;
  public hasLowercase = false;
  public hasNumber = false;
  public hasSpecialChar = false;

  // Expose icons for template
  public readonly faCheck = faCheck;
  public readonly faTimes = faTimes;

  constructor(
    private  fb: FormBuilder,
    private  store: Store,
    private  route: ActivatedRoute,
    private  library: FaIconLibrary,
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
    this.setupPasswordValidation();
    this.getResetTokenFromRoute();
  }

 

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      password1: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[A-Z])/),
          Validators.pattern(/(?=.*[a-z])/), 
          Validators.pattern(/(?=.*[0-9])/), 
          Validators.pattern(/(?=.*[!@#$%^&*])/),
        ],
      ],
      password2: ['', [Validators.required]],
    });
  }

  private setupPasswordValidation(): void {
    this.password1Control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.updatePasswordIndicators(value);
      });
  }

  private getResetTokenFromRoute(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.resetToken = params['token'] || '';
    });
  }

  public get password1Control(): FormControl {
    return this.loginForm.get('password1') as FormControl;
  }

  public get password2Control(): FormControl {
    return this.loginForm.get('password2') as FormControl;
  }

  private updatePasswordIndicators(value: string): void {
    this.hasUppercase = /[A-Z]/.test(value);
    this.hasLowercase = /[a-z]/.test(value);
    this.hasNumber = /[0-9]/.test(value);
    this.hasSpecialChar = /[!@#$%^&*]/.test(value);
  }

  public resetPassword(): void {
    if (this.loginForm.invalid) return;

    const { password1, password2 } = this.loginForm.value;

    if (password1 !== password2) {
      return;
    }

    this.store.dispatch(
      AuthActions.resetPassword({
        resetToken: this.resetToken,
        newPassword: password1,
      })
    );
  }

  public ngOnDestroy(): void {
    this.store.dispatch(AuthActions.resetPasswordState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}