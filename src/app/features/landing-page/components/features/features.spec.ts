import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Features } from './features';
import { FeatureSection } from '@app/shared/compomonents/feature-section/feature-section';

describe('Features', () => {
  let component: Features;
  let fixture: ComponentFixture<Features>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Features, FeatureSection],
    }).compileComponents();

    fixture = TestBed.createComponent(Features);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title and subtitle', () => {
    expect(component.title).toBe('Ready to advance your technical skills?');
    expect(component.subtitle).toContain('SkillDev comes in');
  });

  it('should have 3 features', () => {
    expect(component.features).toHaveLength(3);
  });

  it('should have correct feature data', () => {
    const expectedFeatures = ['Personalized Learning', 'Instant Feedback', 'Community Driven'];

    component.features.forEach((feature, index) => {
      expect(feature.title).toBe(expectedFeatures[index]);
      expect(feature.description).toBeTruthy();
      expect(feature.icon).toContain('assets/');
    });
  });
});
