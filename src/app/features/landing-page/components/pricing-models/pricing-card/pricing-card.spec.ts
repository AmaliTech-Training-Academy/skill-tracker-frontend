import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PricingCard, PricingPlan } from './pricing-card';

describe('PricingCard', () => {
  let component: PricingCard;
  let fixture: ComponentFixture<PricingCard>;

  const mockPlan: PricingPlan = {
    name: 'Pro Plan',
    tagline: 'Perfect for professionals',
    price: 29.99,
    period: '/month',
    isPopular: false,
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  };

  const mockPopularPlan: PricingPlan = {
    ...mockPlan,
    name: 'Premium Plan',
    isPopular: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('plan', mockPlan);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display plan details correctly', () => {
    fixture.componentRef.setInput('plan', mockPlan);
    fixture.detectChanges();

    const planName = fixture.debugElement.query(By.css('.plan-name'));
    const planTagline = fixture.debugElement.query(By.css('.plan-tagline'));
    const priceValue = fixture.debugElement.query(By.css('.price-value'));
    const pricePeriod = fixture.debugElement.query(By.css('.price-period'));

    expect(planName.nativeElement.textContent).toBe('Pro Plan');
    expect(planTagline.nativeElement.textContent).toBe('Perfect for professionals');
    expect(priceValue.nativeElement.textContent).toBe('$29.99');
    expect(pricePeriod.nativeElement.textContent).toBe('/month');
  });

  it('should display all features', () => {
    fixture.componentRef.setInput('plan', mockPlan);
    fixture.detectChanges();

    const featureItems = fixture.debugElement.queryAll(By.css('.feature-item'));
    expect(featureItems.length).toBe(3);
    expect(featureItems[0].nativeElement.textContent.trim()).toBe('Feature 1');
    expect(featureItems[1].nativeElement.textContent.trim()).toBe('Feature 2');
    expect(featureItems[2].nativeElement.textContent.trim()).toBe('Feature 3');
  });

  it('should show popular tag when plan is popular', () => {
    fixture.componentRef.setInput('plan', mockPopularPlan);
    fixture.detectChanges();

    const popularTag = fixture.debugElement.query(By.css('.popular-tag-wrapper'));
    const popularText = fixture.debugElement.query(By.css('.popular-tag'));
    
    expect(popularTag).toBeTruthy();
    expect(popularText.nativeElement.textContent.trim()).toBe('Most Popular');
  });

  it('should not show popular tag when plan is not popular', () => {
    fixture.componentRef.setInput('plan', mockPlan);
    fixture.detectChanges();

    const popularTag = fixture.debugElement.query(By.css('.popular-tag-wrapper'));
    expect(popularTag).toBeFalsy();
  });

  it('should have action button', () => {
    fixture.componentRef.setInput('plan', mockPlan);
    fixture.detectChanges();

    const actionButton = fixture.debugElement.query(By.css('.action-button'));
    expect(actionButton).toBeTruthy();
    expect(actionButton.nativeElement.textContent.trim()).toBe('I want this!');
  });

  it('should display feature icons', () => {
    fixture.componentRef.setInput('plan', mockPlan);
    fixture.detectChanges();

    const featureIcons = fixture.debugElement.queryAll(By.css('.feature-icon'));
    expect(featureIcons.length).toBe(3);
    featureIcons.forEach(icon => {
      expect(icon.nativeElement.src).toContain('blue-checkmark.png');
    });
  });
});
