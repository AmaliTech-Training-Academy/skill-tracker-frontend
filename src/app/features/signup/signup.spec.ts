jest.mock('@app/core', () => ({
  APP_CONSTANTS: {
    APP_ROUTES: {
      LOGIN: '/login',
      EMAIL_VERIFICATION: '/email-verification',
    },
  },
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { Signup } from './signup';
import { APP_CONSTANTS } from '@app/core';
import * as AuthActions from '@app/store/auth/auth.actions';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let mockRouter: jest.Mocked<Pick<Router, 'navigateByUrl'>>;
  let mockStore: jest.Mocked<Pick<Store, 'dispatch' | 'selectSignal'>>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jest.fn(),
    } as jest.Mocked<Pick<Router, 'navigateByUrl'>>;

    mockStore = {
      dispatch: jest.fn(),
      selectSignal: jest.fn().mockReturnValue(signal(false)),
    } as jest.Mocked<Pick<Store, 'dispatch' | 'selectSignal'>>;

    await TestBed.configureTestingModule({
      imports: [Signup, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
      ],
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
      confirmPassword: 'DifferentPass123!',
    });

    expect(component.signupForm.hasError('passwordsMismatch')).toBe(true);

    component.signupForm.patchValue({
      confirmPassword: 'StrongPass123!',
    });

    expect(component.signupForm.hasError('passwordsMismatch')).toBe(false);
  });

  it('should update password requirements computed signal', () => {
    component.passwordValue.set('Test123!');

    const requirements = component.passwordRequirements();
    expect(requirements.every((req) => !req.error)).toBe(true);
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.LOGIN);
  });

  it('should not submit invalid form', () => {
    component.onSubmit();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch register action with valid form', () => {
    component.signupForm.patchValue({
      email: 'test@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!',
    });

    component.onSubmit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.registerUser({
        request: {
          email: 'test@example.com',
          password: 'StrongPass123!',
        },
      }),
    );
  });

  it('should dispatch social login actions', () => {
    component.signInWithGoogle();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.socialLogin({ provider: 'google' }),
    );

    component.signInWithGithub();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.socialLogin({ provider: 'github' }),
    );
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
