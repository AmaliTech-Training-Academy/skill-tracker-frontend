import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { PlanConfirmation } from './plan-confirmation';

describe('PlanConfirmation', () => {
  let component: PlanConfirmation;
  let fixture: ComponentFixture<PlanConfirmation>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockLocation: Partial<Location>;

  beforeEach(async () => {
    const mockParamMap: ParamMap = {
      get: (key: string) => key === 'plan-id' ? '2' : null,
      has: (key: string) => key === 'plan-id',
      getAll: (key: string) => key === 'plan-id' ? ['2'] : [],
      keys: ['plan-id']
    };

    mockRouter = {
      navigate: jest.fn(),
      events: of()
    };
    
    mockActivatedRoute = {
      paramMap: of(mockParamMap)
    };
    
    mockLocation = {
      back: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PlanConfirmation],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize payment form with required validators', () => {
    expect(component.paymentForm).toBeDefined();
    expect(component.paymentForm.get('cardNumber')).toBeDefined();
    expect(component.paymentForm.get('fullName')).toBeDefined();
    expect(component.paymentForm.get('expiry')).toBeDefined();
    expect(component.paymentForm.get('cvv')).toBeDefined();
    
    const cardNumberControl = component.paymentForm.get('cardNumber');
    expect(cardNumberControl?.hasError('required')).toBeTruthy();
  });

  it('should load selected plan from route parameter', () => {
    expect(component.selectedPlan).toBeTruthy();
    expect(component.selectedPlan?.id).toBe(2);
    expect(component.selectedPlan?.name).toBe('Pro');
    expect(component.selectedPlan?.price).toBe(9.99);
  });

  it('should update current step based on current section', () => {
    component.goToSection('chosen-plan');
    expect(component.currentStep).toBe(1);

    component.goToSection('pay-page');
    expect(component.currentStep).toBe(2);

    component.goToSection('done-page');
    expect(component.currentStep).toBe(3);
  });

  it('should not process payment if form is invalid', () => {
    component.paymentForm.reset();
    const initialSection = component.currentSection;
    
    component.pay();
    
    expect(component.currentSection).toBe(initialSection);
    expect(component.paymentForm.touched).toBeTruthy();
  });

  it('should navigate to done-page when payment form is valid', () => {
    component.paymentForm.patchValue({
      cardNumber: '1234567890123456',
      fullName: 'John Doe',
      expiry: '12/25',
      cvv: '123'
    });
    
    component.pay();
    
    expect(component.currentSection).toBe('done-page');
    expect(component.currentStep).toBe(3);
  });

  it('should format price correctly for free and paid plans', () => {
    component.selectedPlan = { id: 1, name: 'Free', price: 0, features: [] };
    expect(component.getFormattedPrice()).toBe('Free');

    component.selectedPlan = { id: 2, name: 'Pro', price: 9.99, features: [] };
    expect(component.getFormattedPrice()).toBe('$9.99');

    component.selectedPlan = { id: 3, name: 'Elite', price: 19.00, features: [] };
    expect(component.getFormattedPrice()).toBe('$19.00');
  });
});