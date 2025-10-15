import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="login-input--group" *ngIf="type !== 'password'; else passwordField">
      <label [for]="id">{{ label }}</label>
      <input [type]="type" [id]="id" [formControl]="control" [placeholder]="placeholder" />

      <!-- Validation -->
      <div class="error-message" *ngIf="control.invalid && control.touched">
        <small *ngIf="control.errors?.['required']">{{ label }} is required.</small>
        <small *ngIf="control.errors?.['email']">Please enter a valid email.</small>
        <small *ngIf="control.errors?.['minlength']">
          {{ label }} must be at least
          {{ control.errors?.['minlength'].requiredLength }} characters.
        </small>
      </div>
    </div>

    <!-- Password field -->
    <ng-template #passwordField>
      <div class="login-inputgroup-password">
        <label [for]="id">{{ label }}</label>
        <div class="input-password">
          <input
            [type]="showPassword ? 'text' : 'password'"
            [id]="id"
            [formControl]="control"
            [placeholder]="placeholder"
          />
          <button
            type="button"
            class="password-toggle"
            (click)="togglePasswordVisibility()"
            tabindex="-1"
          >
            <fa-icon [icon]="showPassword ? faEyeSlash : faEye"></fa-icon>
          </button>
        </div>

        <!-- Validation -->
        <div class="error-message" *ngIf="control.invalid && control.touched">
          <small *ngIf="control.errors?.['required']">{{ label }} is required.</small>
          <small *ngIf="control.errors?.['minlength']">
            {{ label }} must be at least
            {{ control.errors?.['minlength'].requiredLength }} characters.
          </small>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./input-field.scss'],
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
