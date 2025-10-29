import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/core';
import { APP_CONSTANTS } from '@app/core';
import { EmailVerification } from './email-verification';

describe('EmailVerification', () => {
  let component: EmailVerification;
  let fixture: ComponentFixture<EmailVerification>;
  let mockRouter: jest.Mocked<Router>;
  let mockToastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    mockToastService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showInfo: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [EmailVerification, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize OTP form with 6 fields', () => {
    expect(component.otpForm).toBeDefined();
    expect(component.otpFields.length).toBe(6);
    
    component.otpFields.forEach(field => {
      const control = component.otpForm.get(field.name);
      expect(control).toBeDefined();
      expect(control?.hasError('required')).toBe(true);
    });
  });

  it('should validate OTP input pattern', () => {
    const control = component.otpForm.get('otp0');
    
    control?.setValue('a');
    expect(control?.hasError('pattern')).toBe(true);
    
    control?.setValue('5');
    expect(control?.hasError('pattern')).toBe(false);
  });

  it('should update formValid signal when form status changes', () => {
    expect(component.formValid()).toBe(false);
    
    component.otpFields.forEach((field, index) => {
      component.otpForm.get(field.name)?.setValue(index.toString());
    });
    
    expect(component.formValid()).toBe(true);
  });

  it('should start timer on init', fakeAsync(() => {
    component.startTimer();
    expect(component.timeLeft()).toBe(30);
    expect(component.canResend()).toBe(false);
    
    tick(1000);
    expect(component.timeLeft()).toBe(29);
    
    tick(30000);
    expect(component.timeLeft()).toBe(0);
    expect(component.canResend()).toBe(true);
  }));

  it('should resend code and restart timer', fakeAsync(() => {
    component.timeLeft.set(0);
    component.canResend.set(true);
    
    component.resendCode();
    
    expect(mockToastService.showInfo).toHaveBeenCalledWith(
      'Code Sent',
      'A new verification code has been sent to your email.'
    );
    expect(component.timeLeft()).toBe(30);
    expect(component.canResend()).toBe(false);
  }));

  it('should handle OTP input correctly', () => {
    const mockInput = { value: '5' } as HTMLInputElement;
    const event = { target: mockInput } as unknown as Event;
    
    component.onInput(event, 0);
    expect(mockInput.value).toBe('5');
  });

  it('should clear invalid input', () => {
    const mockInput = { value: 'a' } as HTMLInputElement;
    const event = { target: mockInput } as unknown as Event;
    
    component.onInput(event, 0);
    expect(mockInput.value).toBe('');
  });

  it('should handle backspace navigation', () => {
    const mockInput = { value: '' } as HTMLInputElement;
    const mockEvent = { 
      key: 'Backspace', 
      target: mockInput 
    } as unknown as KeyboardEvent;
    
    const mockPrevInput = { nativeElement: { focus: jest.fn() } } as any;
    component['otpInputs'] = {
      toArray: () => [mockPrevInput, mockInput]
    } as any;
    
    component.onKeyDown(mockEvent, 1);
    expect(mockPrevInput.nativeElement.focus).toHaveBeenCalled();
  });

  it('should not submit invalid form', async () => {
    await component.onSubmit();
    expect(component.isSubmitting()).toBe(false);
  });

  it('should submit valid form and navigate to login', fakeAsync(() => {
    component.otpFields.forEach((field, index) => {
      component.otpForm.get(field.name)?.setValue(index.toString());
    });
    
    component.onSubmit();
    expect(component.isSubmitting()).toBe(true);
    
    tick(2000);
    
    expect(mockToastService.showSuccess).toHaveBeenCalledWith(
      'Email Verified',
      'Your email is verified. We’ll redirect you to your dashboard'
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
    expect(component.isSubmitting()).toBe(false);
  }));

  it('should navigate to signup page', () => {
    component.goToSignUp();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.SIGNUP);
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});