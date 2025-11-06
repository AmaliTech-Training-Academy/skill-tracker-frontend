import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

import { PlanConfirmation, Section } from './plan-confirmation';

describe('PlanConfirmation Component', () => {
  let component: PlanConfirmation;
  let fixture: ComponentFixture<PlanConfirmation>;
  let router: jest.Mocked<Router>;
  let location: jest.Mocked<Location>;
  let activatedRoute: {
    snapshot: {
      paramMap: {
        get: jest.Mock;
      };
    };
  };
  let routerEventsSubject: Subject<NavigationEnd>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();

    const routerMock = {
      navigateByUrl: jest.fn(),
      events: routerEventsSubject.asObservable(),
    };

    const locationMock = {
      back: jest.fn(),
    };

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn(),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [PlanConfirmation, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    location = TestBed.inject(Location) as jest.Mocked<Location>;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    it('should initialize with plan ID from route param "plan-id"', () => {
      activatedRoute.snapshot.paramMap.get.mockImplementation((key: string) => {
        return key === 'plan-id' ? '2' : null;
      });
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.selectedPlan).not.toBeNull();
      expect(component.selectedPlan?.id).toBe(2);
      expect(component.selectedPlan?.name).toBe('Pro');
    });

    it('should initialize with plan ID from route param "id"', () => {
      activatedRoute.snapshot.paramMap.get.mockImplementation((key: string) => {
        return key === 'id' ? '3' : null;
      });
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.selectedPlan).not.toBeNull();
      expect(component.selectedPlan?.id).toBe(3);
      expect(component.selectedPlan?.name).toBe('Elite');
    });

    it('should initialize with plan ID from route param "planId"', () => {
      activatedRoute.snapshot.paramMap.get.mockImplementation((key: string) => {
        return key === 'planId' ? '1' : null;
      });
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.selectedPlan).not.toBeNull();
      expect(component.selectedPlan?.id).toBe(1);
      expect(component.selectedPlan?.name).toBe('Free');
    });

    it('should navigate to home if plan ID is not found', () => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue(null);
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should navigate to home if plan ID is invalid', () => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('999');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      expect(component.selectedPlan).toBeNull();
    });

    it('should start at ChosenPlan section', () => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.currentSection).toBe(Section.ChosenPlan);
    });

    it('should start at step 1', () => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.currentStep).toBe(1);
    });
  });

  describe('Payment Form', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize payment form with required fields', () => {
      expect(component.paymentForm.get('cardNumber')).toBeTruthy();
      expect(component.paymentForm.get('fullName')).toBeTruthy();
      expect(component.paymentForm.get('expiry')).toBeTruthy();
      expect(component.paymentForm.get('cvv')).toBeTruthy();
    });

    it('should have required validator on cardNumber field', () => {
      const cardNumber = component.paymentForm.get('cardNumber');
      expect(cardNumber?.hasError('required')).toBe(true);
    });

    it('should have minLength validator on cardNumber field', () => {
      const cardNumber = component.paymentForm.get('cardNumber');
      cardNumber?.setValue('123');
      expect(cardNumber?.hasError('minlength')).toBe(true);

      cardNumber?.setValue('1234567890123456');
      expect(cardNumber?.hasError('minlength')).toBe(false);
    });

    it('should have required validator on fullName field', () => {
      const fullName = component.paymentForm.get('fullName');
      expect(fullName?.hasError('required')).toBe(true);

      fullName?.setValue('John Doe');
      expect(fullName?.hasError('required')).toBe(false);
    });

    it('should have CVV validators', () => {
      const cvv = component.paymentForm.get('cvv');
      expect(cvv?.hasError('required')).toBe(true);

      cvv?.setValue('12');
      expect(cvv?.hasError('minlength')).toBe(true);

      cvv?.setValue('12345');
      expect(cvv?.hasError('maxlength')).toBe(true);

      cvv?.setValue('123');
      expect(cvv?.valid).toBe(true);
    });
  });

  describe('Plan Getters', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('2');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should return correct plan name', () => {
      expect(component.planName).toBe('Pro');
    });

    it('should return correct plan price', () => {
      expect(component.planPrice).toBe(9.99);
    });

    it('should return correct plan features', () => {
      expect(component.features.length).toBeGreaterThan(0);
      expect(component.features).toContain('Full access to all AI-generated courses');
    });

    it('should return empty string when no plan selected', () => {
      component.selectedPlan = null;
      expect(component.planName).toBe('');
    });

    it('should return 0 when no plan selected', () => {
      component.selectedPlan = null;
      expect(component.planPrice).toBe(0);
    });

    it('should return empty array when no plan selected', () => {
      component.selectedPlan = null;
      expect(component.features).toEqual([]);
    });
  });

  describe('Section Navigation', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should navigate to PayPage section', () => {
      component.goToSection(Section.PayPage);
      expect(component.currentSection).toBe(Section.PayPage);
      expect(component.currentStep).toBe(2);
    });

    it('should navigate to DonePage section', () => {
      component.goToSection(Section.DonePage);
      expect(component.currentSection).toBe(Section.DonePage);
      expect(component.currentStep).toBe(3);
    });

    it('should return correct section enum values', () => {
      expect(component.chosenPlanSection).toBe(Section.ChosenPlan);
      expect(component.payPageSection).toBe(Section.PayPage);
      expect(component.donePageSection).toBe(Section.DonePage);
    });
  });

  describe('Go Back Navigation', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should navigate to home from ChosenPlan section', () => {
      component.currentSection = Section.ChosenPlan;
      component.goBack();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should navigate to ChosenPlan from PayPage section', () => {
      component.currentSection = Section.PayPage;
      component.goBack();
      expect(component.currentSection).toBe(Section.ChosenPlan);
    });

    it('should navigate to home from DonePage section', () => {
      component.currentSection = Section.DonePage;
      component.goBack();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });
  });

  describe('Payment Processing', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not process payment if form is invalid', () => {
      component.currentSection = Section.PayPage;
      component.pay();
      expect(component.currentSection).toBe(Section.PayPage);
    });

    it('should mark all fields as touched when form is invalid', () => {
      const markAllAsTouchedSpy = jest.spyOn(component.paymentForm, 'markAllAsTouched');
      component.pay();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should navigate to DonePage when payment form is valid', () => {
      component.paymentForm.patchValue({
        cardNumber: '1234567890123456',
        fullName: 'John Doe',
        expiry: '12/25',
        cvv: '123',
      });

      component.pay();
      expect(component.currentSection).toBe(Section.DonePage);
    });
  });

  describe('Price Formatting', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should format free plan as "Free"', () => {
      expect(component.getFormattedPrice()).toBe('Free');
    });

    it('should format paid plan with dollar sign and decimals', () => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('2');
      const newFixture = TestBed.createComponent(PlanConfirmation);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.getFormattedPrice()).toBe('$9.99');
    });

    it('should return "$0.00" when no plan is selected', () => {
      component.selectedPlan = null;
      expect(component.getFormattedPrice()).toBe('$0.00');
    });
  });

  describe('Dashboard Navigation', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should navigate to dashboard', () => {
      component.goToDashboard();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Component Lifecycle', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
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

  describe('Step Tracking', () => {
    beforeEach(() => {
      activatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      fixture = TestBed.createComponent(PlanConfirmation);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should update step when navigation ends', () => {
      component.currentSection = Section.PayPage;
      routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));

      expect(component.currentStep).toBe(2);
    });

    it('should set step to 1 for ChosenPlan section', () => {
      component.currentSection = Section.ChosenPlan;
      component.goToSection(Section.ChosenPlan);
      expect(component.currentStep).toBe(1);
    });

    it('should set step to 2 for PayPage section', () => {
      component.goToSection(Section.PayPage);
      expect(component.currentStep).toBe(2);
    });

    it('should set step to 3 for DonePage section', () => {
      component.goToSection(Section.DonePage);
      expect(component.currentStep).toBe(3);
    });
  });
});
