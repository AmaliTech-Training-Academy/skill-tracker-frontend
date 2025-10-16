import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  template: `<div class="login-input--group">
    @if (type !== 'password') {
      <label [for]="id">{{ label }}</label>
      <input [type]="type" [id]="id" [formControl]="control" [placeholder]="placeholder" />

      <!-- Validation -->
      @if (control.invalid && control.touched) {
        <div class="error-message">
          @if (control.errors?.['required']) {
            <small>{{ label }} is required.</small>
          }
          @if (control.errors?.['email']) {
            <small>Please enter a valid email.</small>
          }
          @if (control.errors?.['minlength']) {
            <small>
              {{ label }} must be at least
              {{ control.errors?.['minlength'].requiredLength }} characters.
            </small>
          }
        </div>
      }
    } @else {
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
        @if (control.invalid && control.touched) {
          <div class="error-message">
            @if (control.errors?.['required']) {
              <small>{{ label }} is required.</small>
            }
            @if (control.errors?.['minlength']) {
              <small>
                {{ label }} must be at least
                {{ control.errors?.['minlength'].requiredLength }} characters.
              </small>
            }
          </div>
        }
      </div>
    }
  </div> `,
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
