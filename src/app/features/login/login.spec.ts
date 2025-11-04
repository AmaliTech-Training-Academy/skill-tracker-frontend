import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ToastService } from '@app/core';
import * as AuthActions from '@app/store/auth/auth.actions';
import * as AuthSelectors from '@app/store/auth/auth.selectors';
import { Login } from './login';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;
  let toastService: jasmine.SpyObj<ToastService>;

  const destroy$ = new Subject<void>();

  beforeEach(async () => {
    toastService = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);

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

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should have valid form when filled correctly', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should dispatch login action when form is valid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.loginForm.setValue({ email: 'user@example.com', password: 'secret123' });

    component.login();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({
        request: { email: 'user@example.com', password: 'secret123' },
      }),
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
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.socialLogin({ provider: 'google' }),
    );
  });

  it('should dispatch Github social login', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.signInWithGithub();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.socialLogin({ provider: 'github' }),
    );
  });

  it('should call showSuccess when loginSuccess$ emits true', () => {
    (component as any).loginSuccess$ = of(true);
    component.ngOnInit();
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'Login Successful',
      'Logged in successfully! Redirecting you to your dashboard...',
    );
  });

  it('should call showError when loginError emits an error', () => {
    const mockError = { message: 'Invalid credentials' };
    store.overrideSelector(AuthSelectors.selectLoginError, mockError);
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
