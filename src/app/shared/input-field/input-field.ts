import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() id = '';
  @Input({ required: true }) control!: FormControl;

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getErrorKeys(): string[] {
    return this.control.errors ? Object.keys(this.control.errors) : [];
  }

  getErrorMessage(errorKey: string): string {
    const errors: Record<string, string> = {
      required: `${this.label} is required.`,
      email: 'Please enter a valid email.',
      minlength: `${this.label} must be at least ${
        this.control.errors?.['minlength']?.requiredLength
      } characters.`,
      maxlength: `${this.label} must not exceed ${
        this.control.errors?.['maxlength']?.requiredLength
      } characters.`,
    };
    return errors[errorKey] || 'Invalid input.';
  }
}
