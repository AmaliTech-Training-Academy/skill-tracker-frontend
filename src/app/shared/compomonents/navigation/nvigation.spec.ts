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
        // FIX: Added ActivatedRoute mock to resolve NG0201 error from RouterLink directives in the template
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

  it('should initialize showOnlyLogo as false for a standard route', () => {
    mockRouter.url = '/platform';
    component.ngOnInit();
    expect(component.showOnlyLogo).toBeFalsy();
    expect((mockCdr.markForCheck as jest.Mock)).toHaveBeenCalled();
  });

  it('should initialize showOnlyLogo as true for a minimal route', () => {
    mockRouter.url = '/login';
    component.ngOnInit();
    expect(component.showOnlyLogo).toBeTruthy();
    expect((mockCdr.markForCheck as jest.Mock)).toHaveBeenCalled();
  });

  it('should update showOnlyLogo on NavigationEnd event for a minimal route', () => {
    component.ngOnInit();
    expect(component.showOnlyLogo).toBeFalsy();
    (mockCdr.markForCheck as jest.Mock).mockClear();
    
    mockRouter.events.next(new NavigationEnd(1, '/login', '/login'));
    
    expect(component.showOnlyLogo).toBeTruthy();
    expect((mockCdr.markForCheck as jest.Mock)).toHaveBeenCalled();
  });

  it('should update showOnlyLogo on NavigationEnd event for a standard route', () => {
    component.showOnlyLogo = true;
    component.ngOnInit();
    (mockCdr.markForCheck as jest.Mock).mockClear();

    mockRouter.events.next(new NavigationEnd(2, '/', '/'));
    
    expect(component.showOnlyLogo).toBeFalsy();
    expect((mockCdr.markForCheck as jest.Mock)).toHaveBeenCalled();
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