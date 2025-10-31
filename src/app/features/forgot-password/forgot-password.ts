import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, filter } from 'rxjs';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { ToastService } from '@app/core';
import { getFormControl } from '@app/shared';
import { Store } from '@ngrx/store';

import * as AuthActions from '@app/store/auth/auth.actions';
import * as AuthSelectors from '@app/store/auth/auth.selectors';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  public forgotPasswordForm!: FormGroup;
  public loading$ = this.store.select(AuthSelectors.selectIsSendingResetLink);
  private readonly destroy$ = new Subject<void>();
  private previousLoadingState = false;
  
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  
  
  ngOnInit(): void {
    this.initForm();
    this.subscribeToForgotPasswordState();
  }

  private initForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.subscribeToForgotPasswordState();
 
  }

  private subscribeToForgotPasswordState(): void {
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        if (this.previousLoadingState && !isLoading) {
          this.store.select(AuthSelectors.selectForgotPasswordError)
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
              if (!error) {
                this.toastService.showSuccess(
                  'Check your Inbox',
                  'A link to reset your password has been sent to your email.'
                );
              }
            });
        }
        this.previousLoadingState = isLoading;
      });

    this.store.select(AuthSelectors.selectForgotPasswordError)
      .pipe(
        takeUntil(this.destroy$),
        filter(error => error !== null)
      )
      .subscribe(error => {
        this.toastService.showError(
          'Error',
          'This email does not exist in our records.'
        );
      });
  }

  public getControl = getFormControl;

  public submit(): void {
    if (this.forgotPasswordForm.invalid) return;

    const { email } = this.forgotPasswordForm.value;
    this.store.dispatch(AuthActions.forgotPassword({ email }));
  }

  public tryDifferentEmail(): void {
    this.getControl(this.forgotPasswordForm,'email').reset('');
  }

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.resetForgotPasswordState());
    this.destroy$.next();
    this.destroy$.complete();
  
  }
}