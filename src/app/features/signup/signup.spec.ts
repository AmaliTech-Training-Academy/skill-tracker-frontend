import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Signup } from './signup';
import { ToastService } from '@app/core';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let mockRouter: jest.Mocked<Router>;
  let mockToastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    mockToastService = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [Signup, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.get('email')?.hasError('required')).toBe(true);
    expect(component.signupForm.get('password')?.hasError('required')).toBe(true);
    expect(component.signupForm.get('confirmPassword')?.hasError('required')).toBe(true);
    expect(component.signupForm.get('termsAccepted')?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.signupForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should validate password requirements', () => {
    const passwordControl = component.signupForm.get('password');
    
    passwordControl?.setValue('weak');
    expect(passwordControl?.hasError('minlength')).toBe(true);
    expect(passwordControl?.hasError('hasUppercase')).toBe(true);
    
    passwordControl?.setValue('StrongPass123!');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should validate password confirmation match', () => {
    component.signupForm.patchValue({
      password: 'StrongPass123!',
      confirmPassword: 'DifferentPass123!'
    });
    
    expect(component.signupForm.hasError('passwordsMismatch')).toBe(true);
    
    component.signupForm.patchValue({
      confirmPassword: 'StrongPass123!'
    });
    
    expect(component.signupForm.hasError('passwordsMismatch')).toBe(false);
  });

  it('should update password requirements computed signal', () => {
    component.passwordValue.set('Test123!');
    
    const requirements = component.passwordRequirements();
    expect(requirements.every(req => !req.error)).toBe(true);
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.LOGIN);
  });

  it('should not submit invalid form', async () => {
    await component.onSubmit();
    expect(component.isSubmitting()).toBe(false);
  });

  it('should submit valid form and navigate to email verification', async () => {
    // Fill form with valid data
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!',
      termsAccepted: true
    });

    await component.onSubmit();
    
    expect(component.isSubmitting()).toBe(true);
    
    // Wait for async operation to complete
    setTimeout(() => {
      expect(mockToastService.showSuccess).toHaveBeenCalledWith(
        'Account Created',
        "Hurray, Your account is created! We've sent a 6 digit code to your email"
      );
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.EMAIL_VERIFICATION);
    }, 2100);
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});