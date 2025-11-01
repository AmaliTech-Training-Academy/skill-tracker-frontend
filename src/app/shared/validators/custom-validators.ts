import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  public static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }

  public static hasUppercase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[A-Z]/.test(value) ? { hasUppercase: true } : null;
  }

  public static hasLowercase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[a-z]/.test(value) ? { hasLowercase: true } : null;
  }

  public static hasNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[0-9]/.test(value) ? { hasNumber: true } : null;
  }

  public static hasSpecialChar(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && !/[!@#$%&*]/.test(value) ? { hasSpecialChar: true } : null;
  }
}
