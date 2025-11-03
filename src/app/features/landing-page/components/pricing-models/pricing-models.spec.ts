import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PricingModels } from './pricing-models';
import { PricingCard } from './pricing-card/pricing-card';

describe('PricingModels', () => {
  let component: PricingModels;
  let fixture: ComponentFixture<PricingModels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingModels, PricingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingModels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display section title and subtitle', () => {
    const title = fixture.debugElement.query(By.css('.section-title'));
    const subtitle = fixture.debugElement.query(By.css('.section-subtitle'));

    expect(title.nativeElement.textContent).toBe('SkillDev Pricing Models');
    expect(subtitle.nativeElement.textContent.trim()).toBe('Master the essential skills for your success');
  });

  it('should render all pricing plans', () => {
    const pricingCards = fixture.debugElement.queryAll(By.css('app-pricing-card'));
    expect(pricingCards.length).toBe(3);
  });

  it('should have correct plan data structure', () => {
    expect(component.plans).toHaveLength(3);
    
    const freePlan = component.plans[0];
    expect(freePlan.name).toBe('Free Plan');
    expect(freePlan.price).toBe(0);
    expect(freePlan.isPopular).toBe(false);
    expect(freePlan.features).toHaveLength(6);

    const proPlan = component.plans[1];
    expect(proPlan.name).toBe('Pro');
    expect(proPlan.price).toBe(9.99);
    expect(proPlan.isPopular).toBe(true);
    expect(proPlan.features).toHaveLength(5);

    const elitePlan = component.plans[2];
    expect(elitePlan.name).toBe('Elite');
    expect(elitePlan.price).toBe(19.99);
    expect(elitePlan.isPopular).toBe(false);
    expect(elitePlan.features).toHaveLength(6);
  });

  it('should have only one popular plan', () => {
    const popularPlans = component.plans.filter(plan => plan.isPopular);
    expect(popularPlans).toHaveLength(1);
    expect(popularPlans[0].name).toBe('Pro');
  });

  it('should pass correct plan data to pricing cards', () => {
    const pricingCards = fixture.debugElement.queryAll(By.css('app-pricing-card'));
    
    pricingCards.forEach((cardElement, index) => {
      const cardComponent = cardElement.componentInstance as PricingCard;
      expect(cardComponent.plan()).toEqual(component.plans[index]);
    });
  });

  it('should have pricing grid container', () => {
    const pricingGrid = fixture.debugElement.query(By.css('.pricing-grid'));
    expect(pricingGrid).not.toBeNull();
  });

  it('should have section header', () => {
    const sectionHeader = fixture.debugElement.query(By.css('.section-header'));
    expect(sectionHeader).not.toBeNull();
  });
});