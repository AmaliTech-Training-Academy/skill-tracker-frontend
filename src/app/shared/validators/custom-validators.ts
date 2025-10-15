import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  //  Custom static validator for password matching
  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }

  // Password strength validators
  static hasUppercase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[A-Z]/.test(value) ? { hasUppercase: true } : null;
  }

  static hasLowercase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[a-z]/.test(value) ? { hasLowercase: true } : null;
  }

  static hasNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[0-9]/.test(value) ? { hasNumber: true } : null;
  }

  static hasSpecialChar(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[!@#$%&*]/.test(value) ? { hasSpecialChar: true } : null;
  }
}
