import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeroSection } from './hero-section';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';

describe('HeroSection', () => {
  let component: HeroSection;
  let fixture: ComponentFixture<HeroSection>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    const routerSpy = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeroSection],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero content', () => {
    expect(compiled.querySelector('.hero-title')?.textContent).toContain(
      'Master Your Technical Skills',
    );
    expect(compiled.querySelector('.hero-subtitle')?.textContent).toContain(
      'Ready to advance your career',
    );
  });

  it('should navigate to signup when button clicked', () => {
    const navigateSpy = jest.spyOn(component, 'navigateToSignup');
    const signupBtn = compiled.querySelector('.btn-primary') as HTMLButtonElement;
    signupBtn.click();

    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should scroll to features when learn more clicked', () => {
    const scrollSpy = jest.spyOn(component, 'scrollToFeatures');
    const learnMoreBtn = compiled.querySelector('.btn-outline') as HTMLButtonElement;
    learnMoreBtn.click();

    expect(scrollSpy).toHaveBeenCalled();
  });
});
