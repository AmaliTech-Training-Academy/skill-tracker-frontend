import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSelection } from './level-selection';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('LevelSelection', () => {
  let component: LevelSelection;
  let fixture: ComponentFixture<LevelSelection>;
  let router: Router;
  let location: Location;

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const mockLocation = {
    back: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelSelection],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelSelection);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading and isComplete as false', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.isComplete()).toBe(false);
  });

  it('should display initial content in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Tell us your skill level');
  });

  it('should call goBack when the back button is clicked', () => {
    const backButton = fixture.nativeElement.querySelector('.back-btn');
    backButton.click();

    expect(location.back).toHaveBeenCalled();
  });

  it('should navigate to dashboard when onSkip is called', () => {
    component.onSkip();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
