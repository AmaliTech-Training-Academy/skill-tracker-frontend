import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import {
  selectCurrentUser,
  selectIsUpdatingProfile,
  selectUpdateProfileError,
} from '@app/store/auth/auth.selectors';
import { updateProfile } from '@app/store/auth/auth.actions';
import { UpdateUserProfileRequest } from '@app/core';
import { InputFieldComponent } from '@app/shared';

interface SettingsFormControls {
  fullName: FormControl<string>;
  email: FormControl<string>;
  bio: FormControl<string>;
  emailNotifications: FormControl<boolean>;
  pushNotifications: FormControl<boolean>;
}

@Component({
  selector: 'app-dashboard-settings',
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './dashboard-settings.html',
  styleUrl: './dashboard-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSettings {
  protected readonly user = this.store.selectSignal(selectCurrentUser);
  protected readonly isSubmitting = this.store.selectSignal(selectIsUpdatingProfile);
  protected readonly error = this.store.selectSignal(selectUpdateProfileError);
  protected readonly avatarUrl = signal<string | null>(null);

  protected readonly form: FormGroup<SettingsFormControls> = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    bio: ['', [Validators.maxLength(500)]],
    emailNotifications: [false],
    pushNotifications: [false],
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly fb: FormBuilder,
  ) {
    this.initializeFormSync();
  }

  private initializeFormSync(): void {
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.form.patchValue({
          fullName: this.toFormValue(currentUser.fullName),
          email: this.toFormValue(currentUser.email),
          bio: this.toFormValue(currentUser.bio),
        });
      }
    });
  }

  private toFormValue(value: string | null | undefined): string {
    return value ?? '';
  }

  public onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, bio, emailNotifications, pushNotifications } = this.form.getRawValue();

    const payload: UpdateUserProfileRequest = {
      fullName,
      bio,
      emailNotifications,
      pushNotifications,
      avatarUrl: this.avatarUrl() ?? '',
    };

    this.store.dispatch(updateProfile({ request: payload }));
  }
}
