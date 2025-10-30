import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { InputFieldComponent } from './input-field';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;
  let control: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    control = new FormControl('');
    component.control = control;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.label).toBe('');
    expect(component.type).toBe('text');
    expect(component.placeholder).toBe('');
    expect(component.id).toBe('');
    expect(component.passwordRequirements).toEqual([]);
    expect(component.showPasswordRequirements).toBe(false);
    expect(component.formHasPasswordMismatch).toBe(false);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
    
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should format credit card input with spaces', () => {
    const mockEvent = {
      target: { value: '1234567890123456' }
    } as unknown as Event;
    
    component.onCardInput(mockEvent);
    
    expect(component.control.value).toBe('1234 5678 9012 3456');
  });

  it('should restrict CVV to 4 digits only', () => {
    const mockInput = { value: '12345abc' };
    const mockEvent = {
      target: mockInput
    } as unknown as Event;
    
    component.onCVVInput(mockEvent);
    
    expect(component.control.value).toBe('1234');
    expect(mockInput.value).toBe('1234');
  });

  it('should format month input as MM/YY', () => {
    const mockEvent = {
      target: { value: '1225' }
    } as unknown as Event;
    
    component.onMonthInput(mockEvent);
    
    expect(component.control.value).toBe('12/25');
  });

  it('should return error keys from control', () => {
    component.control = new FormControl('', [Validators.required, Validators.email]);
    component.control.markAsTouched();
    component.control.setValue('');
    
    const errorKeys = component.getErrorKeys();
    
    expect(errorKeys).toContain('required');
  });

  it('should generate correct error message for required field', () => {
    component.label = 'Email';
    component.control = new FormControl('', Validators.required);
    component.control.markAsTouched();
    component.control.setValue('');
    
    const message = component.getErrorMessage('required');
    
    expect(message).toBe('Email is required.');
  });

  it('should generate correct error message for email validation', () => {
    component.control = new FormControl('invalid', Validators.email);
    component.control.markAsTouched();
    
    const message = component.getErrorMessage('email');
    
    expect(message).toBe('Please enter a valid email.');
  });

  it('should generate correct error message for minlength', () => {
    component.label = 'Password';
    component.control = new FormControl('12', Validators.minLength(8));
    component.control.markAsTouched();
    
    const message = component.getErrorMessage('minlength');
    
    expect(message).toBe('Password must be at least 8 characters.');
  });

  it('should show password mismatch error when form has mismatch and control is touched', () => {
    component.formHasPasswordMismatch = true;
    component.control.markAsTouched();
    
    expect(component.shouldShowPasswordMismatchError).toBe(true);
  });

  it('should not show password mismatch error when control is untouched', () => {
    component.formHasPasswordMismatch = true;
    component.control.markAsUntouched();
    
    expect(component.shouldShowPasswordMismatchError).toBe(false);
  });

  it('should return error eye icon when control has error and is touched', () => {
    component.control = new FormControl('', Validators.required);
    component.control.markAsTouched();
    component.control.setValue('');
    
    expect(component.eyeIcon).toBe('assets/eye-error.png');
  });

  it('should return normal eye icon when control is valid', () => {
    component.control = new FormControl('valid value');
    
    expect(component.eyeIcon).toBe('assets/eye.png');
  });

  it('should return error cancel eye icon when control has error', () => {
    component.control = new FormControl('', Validators.required);
    component.control.markAsTouched();
    component.control.setValue('');
    
    expect(component.cancelEyeIcon).toBe('assets/cancel-eye-error.png');
  });

  it('should return normal cancel eye icon when control is valid', () => {
    component.control = new FormControl('valid value');
    
    expect(component.cancelEyeIcon).toBe('assets/cancel-eye.png');
  });

  it('should return empty string for unknown error key', () => {
    const message = component.getErrorMessage('unknownError');
    
    expect(message).toBe('');
  });

  it('should handle month input with less than 2 digits', () => {
    const mockEvent = {
      target: { value: '1' }
    } as unknown as Event;
    
    component.onMonthInput(mockEvent);
    
    expect(component.control.value).toBe('1');
  });
});