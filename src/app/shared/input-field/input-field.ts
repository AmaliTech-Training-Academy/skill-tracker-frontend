import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="input-field">
      <label [for]="id">{{ label }}</label>

      <div class="input-wrapper" [ngSwitch]="type">
        <!-- Password input -->
        <ng-container *ngSwitchCase="'password'">
          <input
            [type]="showPassword ? 'text' : 'password'"
            [id]="id"
            [formControl]="formControl"
            [placeholder]="placeholder"
          />
          <button
            type="button"
            class="toggle-btn"
            (click)="togglePasswordVisibility()"
            tabindex="-1"
            aria-label="Toggle password visibility"
          >
            <fa-icon [icon]="showPassword ? faEyeSlash : faEye"></fa-icon>
          </button>
        </ng-container>

        <!-- Default input -->
        <input
          *ngSwitchDefault
          [type]="type"
          [id]="id"
          [formControl]="formControl"
          [placeholder]="placeholder"
        />
      </div>

      <!-- Validation -->
      <div class="error-message" *ngIf="formControl?.invalid && formControl?.touched">
        <small *ngIf="formControl?.errors?.['required']">{{ label }} is required.</small>
        <small *ngIf="formControl?.errors?.['email']">Please enter a valid email.</small>
        <small *ngIf="formControl?.errors?.['minlength']">
          {{ label }} must be at least
          {{ formControl?.errors?.['minlength']?.requiredLength }} characters.
        </small>
      </div>
    </div>
  `,
  styleUrls: ['./input-field.scss'],
})
export class InputFieldComponent {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() id = '';

  // Accept AbstractControl from the parent, which covers FormControl/FormGroup/etc.
  @Input({ required: true }) control!: AbstractControl<any, any>;

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  // Getter that safely casts control to FormControl for template bindings
  get formControl(): FormControl {
    return this.control as FormControl;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
