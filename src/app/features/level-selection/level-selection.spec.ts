import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { ReplaySubject } from 'rxjs';
import confetti, { reset as confettiReset } from 'canvas-confetti';

import { LevelSelection } from './level-selection';
import { OnboardingDataService, User } from '@app/core';
import { selectIsCompletingOnboarding } from '@app/store/auth/auth.selectors';
import { completeOnboardingSuccess } from '@app/store/auth/auth.actions';
import { UserSkill } from '@app/core';

jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: jest.fn(),
  reset: jest.fn(),
}));

describe('LevelSelection', () => {
  let component: LevelSelection;
  let fixture: ComponentFixture<LevelSelection>;
  let location: Location;
  let store: MockStore;
  let onboardingDataService: OnboardingDataService;
  let actions$: ReplaySubject<unknown>;

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const mockLocation = {
    back: jest.fn(),
  };

  const mockOnboardingDataService = {
    skills: jest.fn(() => []),
    getPayload: jest.fn(),
    updateSkillLevel: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    actions$ = new ReplaySubject<unknown>(1);

    await TestBed.configureTestingModule({
      imports: [LevelSelection],

      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: OnboardingDataService, useValue: mockOnboardingDataService },
        provideMockStore({
          selectors: [
            {
              selector: selectIsCompletingOnboarding,
              value: false,
            },
          ],
        }),
        { provide: Actions, useValue: actions$ },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelSelection);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    store = TestBed.inject(MockStore);
    onboardingDataService = TestBed.inject(OnboardingDataService);

    jest.spyOn(store, 'dispatch');

    (confetti as unknown as jest.Mock).mockClear();
    (confettiReset as jest.Mock).mockClear();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call goBack when the back button is clicked', () => {
    const backButton = fixture.nativeElement.querySelector('.back-btn');
    backButton.click();
    expect(location.back).toHaveBeenCalled();
  });

  it('should call updateSkillLevel on the service when onLevelSelect is called', () => {
    const mockSkill: UserSkill = { skillId: 'js', level: null };
    const newLevel = 'Beginner';
    component.onLevelSelect(mockSkill, newLevel);
    expect(onboardingDataService.updateSkillLevel).toHaveBeenCalledWith('js', 'Beginner');
  });

  it('should set isComplete to true and celebrate when completeOnboardingSuccess fires', () => {
    jest.spyOn(component, 'celebrate');
    expect(component.isComplete()).toBe(false);

    actions$.next(completeOnboardingSuccess({ user: {} as User }));
    fixture.detectChanges();

    expect(component.isComplete()).toBe(true);
    expect(component.celebrate).toHaveBeenCalled();
    expect(confetti).toHaveBeenCalled();
  });
});
