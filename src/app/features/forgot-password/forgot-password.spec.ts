import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ForgotPassword } from './forgot-password';
import * as AuthActions from '@app/store/auth/auth.actions';
import { UserEmailRequest } from '@app/core';

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let mockStore: jest.Mocked<Store>;

  beforeEach(async () => {
    mockStore = {
      select: jest.fn().mockReturnValue(of(false)),
      dispatch: jest.fn(),
    } as unknown as jest.Mocked<Store>;

    await TestBed.configureTestingModule({
      imports: [ForgotPassword, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize form with email field', () => {
    expect(component.forgotPasswordForm).toBeDefined();
    expect(component.forgotPasswordForm.get('email')).toBeDefined();
  });

  it('should dispatch forgotPassword action with valid email', () => {
    const testEmail = 'test@example.com';
    component.forgotPasswordForm.patchValue({ email: testEmail });

    component.submit();

    const expectedRequest: UserEmailRequest = { email: testEmail };
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.forgotPassword({ request: expectedRequest })
    );
  });

  it('should not dispatch action when form is invalid', () => {
    component.forgotPasswordForm.patchValue({ email: '' });

    component.submit();

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: AuthActions.forgotPassword.type })
    );
  });

  it('should reset email field and dispatch resetPasswordResetState on tryDifferentEmail', () => {
    component.forgotPasswordForm.patchValue({ email: 'test@example.com' });

    component.tryDifferentEmail();

    expect(component.forgotPasswordForm.get('email')?.value).toBe('');
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.resetPasswordResetState()
    );
  });

  it('should dispatch resetPasswordResetState on destroy', () => {
    component.ngOnDestroy();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AuthActions.resetPasswordResetState()
    );
  });
});