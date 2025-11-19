import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestsSelection } from './interests-selection';
import { ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { OnboardingDataService } from '@app/core';
import { getSkills } from '@app/store/onboarding/onboarding.actions';
import { selectSkills } from '@app/store/onboarding/onboarding.selectors';
import { Skill } from './models/skill.model';

const mockSkills: Skill[] = [
  {
    id: 'python',
    name: 'Python',
    iconUrl: 'assets/python-icon.png',
    description: 'A versatile programming language.',
    category: 'Programming Languages',
    supportedTaskTypes: [],
    levelXpMap: new Map(),
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    iconUrl: 'assets/js-icon.png',
    description: 'The language of the web.',
    category: 'Programming Languages',
    supportedTaskTypes: [],
    levelXpMap: new Map(),
  },
];

const mockRouter = {
  navigateByUrl: jest.fn(),
};

const mockOnboardingDataService = {
  setInterests: jest.fn(),
};

describe('InterestsSelection', () => {
  let component: InterestsSelection;
  let fixture: ComponentFixture<InterestsSelection>;
  let store: MockStore;
  let router: Router;
  let onboardingDataService: OnboardingDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestsSelection],

      providers: [
        provideMockStore({
          selectors: [{ selector: selectSkills, value: mockSkills }],
        }),
        { provide: Router, useValue: mockRouter },
        {
          provide: OnboardingDataService,
          useValue: mockOnboardingDataService,
        },
      ],
    })
      .overrideComponent(InterestsSelection, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(InterestsSelection);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    onboardingDataService = TestBed.inject(OnboardingDataService);

    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getSkills action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(getSkills());
  });

  it('should get skills from the store', () => {
    expect(component.badges()).toEqual(mockSkills);
  });

  it('should render skill chips for each skill', () => {
    const chipElements = fixture.nativeElement.querySelectorAll('app-interests-chip');
    expect(chipElements.length).toBe(mockSkills.length);
  });

  it('should add a skill to selectedBadges when toggleBadge is called', () => {
    component.toggleBadge('python');
    expect(component.selectedBadges()).toContain('python');
  });

  it('should remove a skill from selectedBadges when toggled again', () => {
    component.toggleBadge('python');
    component.toggleBadge('python');
    expect(component.selectedBadges()).not.toContain('python');
  });
});
