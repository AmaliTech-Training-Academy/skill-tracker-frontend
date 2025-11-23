import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;
  let mockStore: Partial<Store>;

  beforeEach(async () => {
    mockStore = {
      selectSignal: jest.fn().mockReturnValue(() => false),
    };

    await TestBed.configureTestingModule({
      imports: [Navigation, RouterTestingModule],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show unauthenticated state by default', () => {
    expect(component.isAuthenticated()).toBe(false);
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen).toBe(false);

    component.toggleMenu();
    expect(component.isMobileMenuOpen).toBe(true);

    component.toggleMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should call navigateToDashboard method', () => {
    const navigateSpy = jest.spyOn(component, 'navigateToDashboard');
    component.navigateToDashboard();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should navigate to login when login link clicked', () => {
    const loginLink = fixture.nativeElement.querySelector('a[routerLink="/login"]');
    expect(loginLink).toBeTruthy();
    expect(loginLink.getAttribute('routerLink')).toBe('/login');
  });

  it('should navigate to signup when signup button clicked', () => {
    const signupBtn = fixture.nativeElement.querySelector('button[routerLink="/signup"]');
    expect(signupBtn).toBeTruthy();
    expect(signupBtn.getAttribute('routerLink')).toBe('/signup');
  });

  it('should show dashboard button when authenticated', () => {
    mockStore.selectSignal = jest.fn().mockReturnValue(() => true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Navigation, RouterTestingModule],
      providers: [{ provide: Store, useValue: mockStore }],
    });

    const authFixture = TestBed.createComponent(Navigation);
    authFixture.detectChanges();

    const dashboardBtn = authFixture.nativeElement.querySelector('.dashboard-btn');
    expect(dashboardBtn).toBeTruthy();
  });

  it('should hide signup button when authenticated', () => {
    mockStore.selectSignal = jest.fn().mockReturnValue(() => true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Navigation, RouterTestingModule],
      providers: [{ provide: Store, useValue: mockStore }],
    });

    const authFixture = TestBed.createComponent(Navigation);
    authFixture.detectChanges();

    const signupBtn = authFixture.nativeElement.querySelector('button[routerLink="/signup"]');
    expect(signupBtn).toBeFalsy();
  });

  it('should show only logo on minimal routes', () => {
    component['updateShowOnlyLogo']('/login');
    expect(component.showOnlyLogo).toBe(true);
  });
});
