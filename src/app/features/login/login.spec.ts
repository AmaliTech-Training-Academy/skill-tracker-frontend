import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as AuthActions from '@app/store/auth/auth.actions';
import * as AuthSelectors from '@app/store/auth/auth.selectors';
import { ToastService } from '@app/core';
import { Login } from './login';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;
  let toastService: { showSuccess: jest.Mock; showError: jest.Mock };

  beforeEach(async () => {
    toastService = { showSuccess: jest.fn(), showError: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Login],
      providers: [
        provideMockStore({
          selectors: [
            { selector: AuthSelectors.selectIsLoggingIn, value: false },
            { selector: AuthSelectors.selectLoginError, value: null },
            { selector: AuthSelectors.selectIsAuthenticated, value: of(false) },
          ],
        }),
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should dispatch login action when form is valid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    component.login();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({ request: { email: 'test@example.com', password: '123456' } }),
    );
  });

  it('should not dispatch login action when form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.loginForm.setValue({ email: '', password: '' });
    component.login();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch Google social login', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.signInWithGoogle();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.socialLogin({ provider: 'google' }));
  });

  it('should dispatch Github social login', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.signInWithGithub();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.socialLogin({ provider: 'github' }));
  });

  it('should show success toast on login success', () => {
    (component as any).loginSuccess$ = of(true);
    component.ngOnInit();
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'Login Successful',
      'Logged in successfully! Redirecting you to your dashboard...',
    );
  });

  it('should show error toast on login error', () => {
    const error = { message: 'Invalid credentials' };
    store.overrideSelector(AuthSelectors.selectLoginError, error);
    store.refreshState();

    component.ngOnInit();

    expect(toastService.showError).toHaveBeenCalledWith(
      'Login Failed',
      'Invalid credentials',
    );
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
