import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

export interface PasswordRequirement {
  key: string;
  message: string;
  error: boolean;
}

type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'credit-card'
  | 'cvv'
  | 'month';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() id = '';
  @Input({ required: true }) control!: FormControl;
  @Input() passwordRequirements: PasswordRequirement[] = [];
  @Input() showPasswordRequirements = false;
  @Input() formHasPasswordMismatch = false;

  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  
  onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    this.control.setValue(value, { emitEvent: false });
  }

  
  onCVVInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
    this.control.setValue(input.value, { emitEvent: false });
  }

 
  onMonthInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    this.control.setValue(value, { emitEvent: false });
  }

  getErrorKeys(): string[] {
    return this.control.errors ? Object.keys(this.control.errors) : [];
  }

  private static errorMessages: Record<string, string> = {
    required: '{label} is required.',
    email: 'Please enter a valid email.',
    minlength: '{label} must be at least {requiredLength} characters.',
    maxlength: '{label} must not exceed {requiredLength} characters.',
    passwordsMismatch: 'Passwords do not match.',
  };

  getErrorMessage(errorKey: string): string {
    const msg = InputFieldComponent.errorMessages[errorKey];
    if (!msg) return '';
    const requiredLength = this.control.errors?.[errorKey]?.requiredLength ?? '';
    return msg.replace('{label}', this.label).replace('{requiredLength}', requiredLength);
  }

  get shouldShowPasswordMismatchError(): boolean {
    return this.control.touched && this.formHasPasswordMismatch;
  }

  get eyeIcon(): string {
    const hasError =
      (this.control.invalid && this.control.touched) || this.shouldShowPasswordMismatchError;
    return hasError ? 'assets/eye-error.png' : 'assets/eye.png';
  }

  get cancelEyeIcon(): string {
    const hasError =
      (this.control.invalid && this.control.touched) || this.shouldShowPasswordMismatchError;
    return hasError ? 'assets/cancel-eye-error.png' : 'assets/cancel-eye.png';
  }
}