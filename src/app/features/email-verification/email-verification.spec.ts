jest.mock('@app/core', () => ({
  APP_CONSTANTS: {
    APP_ROUTES: {
      SIGNUP: '/signup',
    },
  },
}));

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APP_CONSTANTS } from '@app/core';
import { EmailVerification } from './email-verification';
import * as AuthActions from '@app/store/auth/auth.actions';
import { signal } from '@angular/core';

describe('EmailVerification', () => {
  let component: EmailVerification;
  let fixture: ComponentFixture<EmailVerification>;
  let mockRouter: jest.Mocked<Pick<Router, 'navigateByUrl'>>;
  let mockStore: jest.Mocked<Pick<Store, 'dispatch' | 'selectSignal'>>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jest.fn(),
    } as jest.Mocked<Pick<Router, 'navigateByUrl'>>;

    mockStore = {
      dispatch: jest.fn(),
      selectSignal: jest.fn(),
    } as jest.Mocked<Pick<Store, 'dispatch' | 'selectSignal'>>;

    await TestBed.configureTestingModule({
      imports: [EmailVerification, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.selectSignal
      .mockReturnValueOnce(signal(false))
      .mockReturnValue(signal('test@example.com'));

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

    component.otpFields.forEach((field) => {
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
    expect(component.timeLeft()).toBe(120);
    expect(component.canResend()).toBe(false);

    tick(1000);
    expect(component.timeLeft()).toBe(119);

    tick(120000);
    expect(component.timeLeft()).toBe(0);
    expect(component.canResend()).toBe(true);
  }));

  it('should dispatch resend verification action', () => {
    component.timeLeft.set(0);
    component.canResend.set(true);

    component.resendCode();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.resendVerification({ email: 'test@example.com' }),
    );
    expect(component.timeLeft()).toBe(120);
    expect(component.canResend()).toBe(false);
  });

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
      target: mockInput,
    } as unknown as KeyboardEvent;

    const mockPrevInput = { nativeElement: { focus: jest.fn() } } as {
      nativeElement: { focus: jest.Mock };
    };
    component['otpInputs'] = {
      toArray: () => [mockPrevInput, mockInput],
    } as Partial<{ toArray: () => { nativeElement: { focus: jest.Mock } }[] }>;

    component.onKeyDown(mockEvent, 1);
    expect(mockPrevInput.nativeElement.focus).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    component.onSubmit();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch verify email action with valid form', () => {
    component.otpFields.forEach((field, index) => {
      component.otpForm.get(field.name)?.setValue(index.toString());
    });

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.verifyEmailOtp({
        request: {
          code: '012345',
          email: 'test@example.com',
        },
      }),
    );
  });

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
