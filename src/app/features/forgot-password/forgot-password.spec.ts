import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPassword } from './forgot-password';
import { ToastService } from 'src/app/core/services/toast/toast-service';
import { ForgotPasswordService } from './forgot-password.service';

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let forgotPasswordServiceSpy: jasmine.SpyObj<ForgotPasswordService>;

  beforeEach(async () => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
    forgotPasswordServiceSpy = jasmine.createSpyObj('ForgotPasswordService', ['sendResetLink']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ForgotPassword],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ForgotPasswordService, useValue: forgotPasswordServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with an email control', () => {
    expect(component.getControl('email')).toBeTruthy();
  });

  it('should show error toast on failed reset', () => {
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    forgotPasswordServiceSpy.sendResetLink.and.returnValue(throwError(() => new Error('error')));

    component.submit();

    expect(toastServiceSpy.showError).toHaveBeenCalled();
  });

  it('should reset the email field when trydifferentemail() is called', () => {
    component.getControl('email').setValue('user@example.com');
    component.trydifferentemail();
    expect(component.getControl('email').value).toBe('');
  });
});
