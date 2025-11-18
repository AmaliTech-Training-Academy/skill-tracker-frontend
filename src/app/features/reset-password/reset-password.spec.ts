import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, provideStore } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { ResetPassword } from './reset-password';
import { ToastService } from '@app/core';
import * as AuthActions from '@app/store/auth/auth.actions';
import {
  selectResetToken,
  selectIsResettingPassword,
  selectResetPasswordError,
  selectResetPasswordSuccess,
} from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '@app/core';

class MockRouter {
  navigateByUrl = jest.fn();
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jest.fn(),
    },
  };
}

class MockToastService {
  showError = jest.fn();
}

class MockFaIconLibrary {
  addIcons = jest.fn();
}

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let mockRouter: MockRouter;
  let mockStore: Store;
  let mockToastService: MockToastService;
  let mockActivatedRoute: MockActivatedRoute;

  const mockToken = 'valid-reset-token';

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockToastService = new MockToastService();
    mockActivatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ResetPassword],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastService, useValue: mockToastService },
        { provide: FaIconLibrary, useValue: new MockFaIconLibrary() },
        provideStore(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store);
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as any;
  });

  it('should create the component', () => {
    jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get').mockReturnValue(mockToken);
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should initialize form when reset token is present', () => {
    jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get').mockReturnValue(mockToken);
    (component as any)['resetToken'] = mockToken;
    component.ngOnInit();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.contains('password')).toBeTruthy();
    expect(component.loginForm.contains('confirmPassword')).toBeTruthy();
    expect(mockToastService.showError).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should navigate away and show error if reset token is missing', () => {
    jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get').mockReturnValue(null);
    component.ngOnInit();
    expect(mockToastService.showError).toHaveBeenCalledWith(APP_CONSTANTS.APP_ERRORS.RESET_TOKEN.TITLE, APP_CONSTANTS.APP_ERRORS.RESET_TOKEN.MESSAGE);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(APP_CONSTANTS.APP_ROUTES.FORGOT_PASSWORD);
  });

  it('should update passwordValue signal on password input change', fakeAsync(() => {
    jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get').mockReturnValue(mockToken);
    (component as any)['resetToken'] = mockToken;
    component.ngOnInit();
    
    component.currentPasswordControl.setValue('NewPass1!');
    tick(1);
    
    expect(component.passwordValue()).toBe('NewPass1!');
  }));


  it('should not submit if form is invalid', () => {
    jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get').mockReturnValue(mockToken);
    (component as any)['resetToken'] = mockToken;
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    
    component.currentPasswordControl.setValue('short');
    component.newPasswordControl.setValue('short');
    
    component.onSubmit();
    
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get').mockReturnValue(mockToken);
    (component as any)['resetToken'] = mockToken;
    component.ngOnInit();
    const destroySubject = (component as any).destroy$;
    const nextSpy = jest.spyOn(destroySubject, 'next');
    const completeSpy = jest.spyOn(destroySubject, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});