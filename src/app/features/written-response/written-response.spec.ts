import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { WrittenResponse } from './written-response';
import { ToastService } from '@app/core';
import * as WrittenResponseActions from './store/written-response.action';

describe('WrittenResponse Component', () => {
  let component: WrittenResponse;
  let fixture: ComponentFixture<WrittenResponse>;
  let mockStore: jest.Mocked<Store>;
  let mockRouter: jest.Mocked<Router>;
  let mockToastService: jest.Mocked<ToastService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  const mockTaskData = {
    title: 'Test Task',
    difficulty: 'Medium',
    xpReward: 100,
    prompt: 'Write your response here',
    hints: ['Hint 1', 'Hint 2'],
    userAnswer: '',
    loading: false,
    error: null,
    expectedDuration: 10,
  };

  beforeEach(async () => {
    mockStore = {
      select: jest.fn(),
      dispatch: jest.fn(),
    } as unknown as jest.Mocked<Store>;

    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockToastService = {
      showError: jest.fn(),
      showSuccess: jest.fn(),
    } as unknown as jest.Mocked<ToastService>;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('task-123'),
        },
      } as unknown as ActivatedRoute['snapshot'],
    };

    // Setup store selectors
    mockStore.select.mockImplementation((selector: unknown) => {
      if (selector === undefined) return of(mockTaskData.title);
      return of(mockTaskData.title);
    });

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
    const paramMapGet = mockActivatedRoute.snapshot!.paramMap.get as jest.Mock;
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

  it('should use default timer duration when duration is invalid', fakeAsync(() => {
    const expectedDuration$ = new Subject<number>();
    mockStore.select.mockReturnValue(expectedDuration$);

    fixture.detectChanges();

    expectedDuration$.next(0);
    tick();

    expect(component.timerLabel).toBe('10:00');
  }));

  it('should initialize progress value to 0', () => {
    fixture.detectChanges();
    expect(component.progressValue).toBe(0);
  });

  it('should update timer label correctly', fakeAsync(() => {
    fixture.detectChanges();

    component['startTimer'](65);

    expect(component.timerLabel).toBe('01:05');

    tick(1000);
    expect(component.timerLabel).toBe('01:04');
  }));

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

  it('should complete quiz and set progress to 100 on submit', () => {
    component.submitTask();

    expect(component.progressValue).toBe(100);
    expect(component.quizCompleted).toBe(true);
  });

  it('should allow review of task', () => {
    component.quizCompleted = true;
    component.progressValue = 100;

    component.reviewTask();

    expect(component.quizCompleted).toBe(false);
    expect(component.progressValue).toBe(50);
  });

  it('should stop timer when quiz is completed', fakeAsync(() => {
    fixture.detectChanges();

    component['startTimer'](10);

    tick(3000);
    expect(component.timerLabel).toBe('00:07');

    component.submitTask();

    tick(5000);
    expect(component.timerLabel).toBe('00:07');
  }));

  it('should unsubscribe from timer subscription on destroy', () => {
    const expectedDuration$ = new Subject<number>();
    mockStore.select.mockReturnValue(expectedDuration$);

    fixture.detectChanges();

    const unsubscribeSpy = jest.spyOn(component['timerSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should dispatch clear state action on destroy', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(WrittenResponseActions.clearWrittenResponseState());
  });

  it('should update timer label every second', fakeAsync(() => {
    fixture.detectChanges();
    component['startTimer'](5);

    expect(component.timerLabel).toBe('00:05');
    tick(1000);
    expect(component.timerLabel).toBe('00:04');
    tick(1000);
    expect(component.timerLabel).toBe('00:03');
    tick(1000);
    expect(component.timerLabel).toBe('00:02');
    tick(1000);
    expect(component.timerLabel).toBe('00:01');
    tick(1000);
    expect(component.timerLabel).toBe('00:00');
  }));

  it('should format timer label with leading zeros', () => {
    component['updateTimerLabel'](65);
    expect(component.timerLabel).toBe('01:05');

    component['updateTimerLabel'](600);
    expect(component.timerLabel).toBe('10:00');

    component['updateTimerLabel'](5);
    expect(component.timerLabel).toBe('00:05');
  });

  it('should handle completing quiz manually before timer ends', fakeAsync(() => {
    fixture.detectChanges();
    component['startTimer'](60);

    tick(5000);
    expect(component.quizCompleted).toBe(false);

    component['completeQuiz']();

    expect(component.quizCompleted).toBe(true);

    tick(10000);
    expect(component.timerLabel).toBe('00:55');
  }));

  it('should trigger change detection on timer tick', fakeAsync(() => {
    const cdSpy = jest.spyOn(component['cd'], 'detectChanges');
    fixture.detectChanges();

    component['startTimer'](5);

    tick(1000);

    expect(cdSpy).toHaveBeenCalled();
  }));

  it('should initialize all observables correctly', () => {
    expect(component.taskTitle$).toBeDefined();
    expect(component.taskDifficulty$).toBeDefined();
    expect(component.xpReward$).toBeDefined();
    expect(component.prompt$).toBeDefined();
    expect(component.hints$).toBeDefined();
    expect(component.userAnswer$).toBeDefined();
    expect(component.loading$).toBeDefined();
    expect(component.error$).toBeDefined();
    expect(component.expectedDuration$).toBeDefined();
  });

  it('should initialize quizCompleted to false', () => {
    expect(component.quizCompleted).toBe(false);
  });

  it('should initialize timerLabel to 00:00', () => {
    expect(component.timerLabel).toBe('00:00');
  });
});
