import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from './navigation';

class MockRouter {
  public url = '/';
  public events = new Subject<NavigationEnd>();
}

class MockActivatedRoute {
  snapshot = {};
  paramMap = new Subject();
  queryParamMap = new Subject();
}

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;
  let mockRouter: MockRouter;
  let mockCdr: ChangeDetectorRef;

  beforeEach(async () => {
    mockRouter = new MockRouter();

    const cdrMock = {
      markForCheck: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ChangeDetectorRef, useValue: cdrMock },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    mockCdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close mobile menu if navigating to a minimal route while open', () => {
    component.isMobileMenuOpen = true;
    component.ngOnInit();

    mockRouter.events.next(new NavigationEnd(3, '/signup', '/signup'));
    
    expect(component.showOnlyLogo).toBeTruthy();
    expect(component.isMobileMenuOpen).toBeFalsy();
  });

  it('should not close mobile menu if navigating to a standard route while open', () => {
    component.isMobileMenuOpen = true;
    component.ngOnInit();

    mockRouter.events.next(new NavigationEnd(4, '/platform', '/platform'));
    
    expect(component.showOnlyLogo).toBeFalsy();
    expect(component.isMobileMenuOpen).toBeTruthy();
  });

  it('should handle route normalization correctly with query params and fragments for minimal route', () => {
    component['updateShowOnlyLogo']('/login?id=123#fragment');
    expect(component.showOnlyLogo).toBeTruthy();
  });

  it('should handle route normalization correctly for nested minimal route', () => {
    component['updateShowOnlyLogo']('/reset-password/confirm');
    expect(component.showOnlyLogo).toBeTruthy();
  });

  it('should handle route normalization correctly for standard route with query params and fragments', () => {
    component['updateShowOnlyLogo']('/platform?id=123#fragment');
    expect(component.showOnlyLogo).toBeFalsy();
  });

  it('should handle route normalization for root route without trailing slash', () => {
    component['updateShowOnlyLogo'](''); 
    expect(component.showOnlyLogo).toBeFalsy();
  });

  it('should toggle isMobileMenuOpen state', () => {
    expect(component.isMobileMenuOpen).toBeFalsy();
    component.toggleMenu();
    expect(component.isMobileMenuOpen).toBeTruthy();
    component.toggleMenu();
    expect(component.isMobileMenuOpen).toBeFalsy();
  });

  it('should unsubscribe from router events on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    
    component.ngOnInit();
    component.ngOnDestroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
