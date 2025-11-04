import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { signal } from '@angular/core';

import { Login } from './login';
import { ToastService } from '@app/core';
import * as AuthActions from '@app/store/auth/auth.actions';
import * as AuthSelectors from '@app/store/auth/auth.selectors';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;
  let toastService: jest.Mocked<ToastService>;

  const initialState = {
    auth: {
      isLoggingIn: false,
      loginError: null,
      isAuthenticated: false,
    },
  };

  beforeEach(async () => {
    const toastServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: ToastService, useValue: toastServiceMock },
      ],
    })
      .overrideComponent(Login, {
        remove: { imports: [RouterLink] },
        add: { imports: [] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;

    store.overrideSelector(AuthSelectors.selectIsLoggingIn, false);
    store.overrideSelector(AuthSelectors.selectLoginError, null);
    store.overrideSelector(AuthSelectors.selectIsAuthenticated, false);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have email field with required and email validators', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should have password field with required and minLength validators', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.hasError('required')).toBe(true);

    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBe(true);

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBe(false);
  });

  it('should not dispatch login action when form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.login();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch login action when form is valid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.login();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({
        request: { email: 'test@example.com', password: 'password123' },
      }),
    );
  });

  it('should dispatch socialLogin action with google provider', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.signInWithGoogle();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.socialLogin({ provider: 'google' }));
  });

  it('should dispatch socialLogin action with github provider', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.signInWithGithub();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.socialLogin({ provider: 'github' }));
  });

  it('should complete destroy$ subject on component destroy', () => {
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    const nextSpy = jest.spyOn(component['destroy$'], 'next');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have getFormControl method available', () => {
    expect(component.getFormControl).toBeDefined();
    expect(typeof component.getFormControl).toBe('function');
  });
});
