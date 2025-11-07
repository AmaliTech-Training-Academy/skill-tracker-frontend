import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { getFormControl } from '@app/shared';
import { Store } from '@ngrx/store';
import * as AuthActions from '@app/store/auth/auth.actions';
import { selectIsRequestingPasswordReset } from '@app/store/auth/auth.selectors';
import { UserEmailRequest } from '@app/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword implements OnDestroy {
  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  public forgotPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public loading$: Observable<boolean> = this.store.select(selectIsRequestingPasswordReset);
  private readonly destroy$ = new Subject<void>();

  private readonly loadingSubscription = this.loading$
    .pipe(takeUntil(this.destroy$))
    .subscribe((isLoading) => {
      if (!isLoading) {
        this.cdr.detectChanges();
      }
    });

  public getControl = getFormControl;

  public submit(): void {
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.invalid) return;

    const email = this.forgotPasswordForm.value.email as string;
    const request: UserEmailRequest = { email };

    this.store.dispatch(AuthActions.forgotPassword({ request }));
    this.getControl(this.forgotPasswordForm, 'email').reset('');
  }

  public tryDifferentEmail(): void {
    this.getControl(this.forgotPasswordForm, 'email').reset('');
    this.store.dispatch(AuthActions.resetPasswordResetState());
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.resetPasswordResetState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
