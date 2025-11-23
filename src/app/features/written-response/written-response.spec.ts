import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { WrittenResponse } from './written-response';
import { ToastService } from '@app/core';
import * as WrittenResponseActions from './store/written-response.action';

describe('WrittenResponse Component', () => {
  let component: WrittenResponse;
  let fixture: ComponentFixture<WrittenResponse>;
  let mockStore: {
    selectSignal: jest.Mock;
    select: jest.Mock;
    dispatch: jest.Mock;
  };
  let mockRouter: {
    navigateByUrl: jest.Mock;
  };
  let mockToastService: {
    showError: jest.Mock;
    showSuccess: jest.Mock;
  };
  let mockActivatedRoute: {
    snapshot: {
      paramMap: {
        get: jest.Mock;
      };
    };
  };

  // Mock signals
  let mockTaskTitle: WritableSignal<string>;
  let mockTaskDifficulty: WritableSignal<string>;
  let mockXpReward: WritableSignal<number>;
  let mockPrompt: WritableSignal<string | undefined>;
  let mockHints: WritableSignal<string[]>;
  let mockUserAnswer: WritableSignal<string>;
  let mockLoading: WritableSignal<boolean>;
  let mockError: WritableSignal<string | null>;
  let mockExpectedDuration: WritableSignal<number>;
  let mockIsSubmitting: WritableSignal<boolean>;
  let mockTaskId: WritableSignal<string | null>;
  let mockQuizCompleted: WritableSignal<boolean>;

  beforeEach(async () => {
    mockTaskTitle = signal('Test Task');
    mockTaskDifficulty = signal('Medium');
    mockXpReward = signal(100);
    mockPrompt = signal('Write your response here');
    mockHints = signal(['Hint 1', 'Hint 2']);
    mockUserAnswer = signal('');
    mockLoading = signal(false);
    mockError = signal<string | null>(null);
    mockExpectedDuration = signal(10);
    mockIsSubmitting = signal(false);
    mockTaskId = signal<string | null>('task-123');
    mockQuizCompleted = signal(false);

    mockStore = {
      selectSignal: jest.fn(),
      select: jest.fn(),
      dispatch: jest.fn(),
    };

    mockRouter = {
      navigateByUrl: jest.fn(),
    };

    mockToastService = {
      showError: jest.fn(),
      showSuccess: jest.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('task-123'),
        },
      },
    };

    mockStore.selectSignal.mockImplementation((selector: unknown) => {
      const selectorString = selector?.toString() || '';

      if (selectorString.includes('Title')) return mockTaskTitle;
      if (selectorString.includes('Difficulty')) return mockTaskDifficulty;
      if (selectorString.includes('XpReward')) return mockXpReward;
      if (selectorString.includes('Prompt')) return mockPrompt;
      if (selectorString.includes('Hints')) return mockHints;
      if (selectorString.includes('UserAnswer')) return mockUserAnswer;
      if (selectorString.includes('Loading')) return mockLoading;
      if (selectorString.includes('Error')) return mockError;
      if (selectorString.includes('ExpectedDuration')) return mockExpectedDuration;
      if (selectorString.includes('IsSubmitting')) return mockIsSubmitting;
      if (selectorString.includes('TaskId')) return mockTaskId;
      if (selectorString.includes('QuizCompleted')) return mockQuizCompleted;

      return mockTaskTitle;
    });

    mockStore.select.mockReturnValue(of(10));

    await TestBed.configureTestingModule({
      imports: [WrittenResponse],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WrittenResponse);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component['intervalId']) {
      clearInterval(component['intervalId']);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task on init when taskId is present', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      WrittenResponseActions.loadWrittenResponseTask({ taskId: 'task-123' }),
    );
  });

  it('should show error and navigate when taskId is missing', () => {
    const paramMapGet = mockActivatedRoute.snapshot.paramMap.get as jest.Mock;
    paramMapGet.mockReturnValue(null);

    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    const toastSpy = jest.spyOn(mockToastService, 'showError');
    const routerSpy = jest.spyOn(mockRouter, 'navigateByUrl');

    fixture.detectChanges();

    expect(toastSpy).toHaveBeenCalledWith(
      'Task Error',
      'The task is not available, try a different task',
    );
    expect(routerSpy).toHaveBeenCalledWith('/dashboard/tasks');
    expect(dispatchSpy).toHaveBeenCalledWith(
      WrittenResponseActions.loadWrittenResponseTaskFailure({ error: 'Task ID not provided.' }),
    );
  });

  it('should initialize timer with expected duration', fakeAsync(() => {
    fixture.detectChanges();

    tick();

    expect(component.timerLabel).toBe('10:00');
  }));

  it('should initialize progress value to 0', () => {
    fixture.detectChanges();
    expect(component.progressValue).toBe(0);
  });

  it('should dispatch update action when user types', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

    component.onUserTyping('Test answer');

    expect(dispatchSpy).toHaveBeenCalledWith(
      WrittenResponseActions.updateWrittenResponseUserAnswer({ answer: 'Test answer' }),
    );
  });

  it('should pad single digit numbers with zero', () => {
    expect(component['pad'](5)).toBe('05');
    expect(component['pad'](10)).toBe('10');
    expect(component['pad'](0)).toBe('00');
  });

  it('should dispatch review action when reviewing task', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

    component.reviewTask();

    expect(dispatchSpy).toHaveBeenCalledWith(WrittenResponseActions.reviewWrittenResponseTask());
  });

  it('should not tick timer when quiz is completed', fakeAsync(() => {
    mockQuizCompleted.set(true);
    fixture.detectChanges();

    component['startTimer'](10);

    tick(3000);
    expect(component.timerLabel).toBe('00:10');
  }));

  it('should dispatch clear state action on destroy', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(WrittenResponseActions.clearWrittenResponseState());
  });

  it('should format timer label with leading zeros', () => {
    component['updateTimerLabel'](65);
    expect(component.timerLabel).toBe('01:05');

    component['updateTimerLabel'](600);
    expect(component.timerLabel).toBe('10:00');

    component['updateTimerLabel'](5);
    expect(component.timerLabel).toBe('00:05');
  });

  it('should initialize timer label to 00:00', () => {
    expect(component.timerLabel).toBe('00:00');
  });
});
