import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { WrittenResponse, TaskFeedback } from './written-response';
import { ToastService } from '@app/core';
import * as WrittenResponseActions from './store/written-response.action';
import { SubmissionResponse } from '@app/core/models/tasks-model';

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
  let mockSubmission: WritableSignal<SubmissionResponse | null>;
  let mockFeedback: WritableSignal<TaskFeedback | null>;
  let mockSubmissionStatus: WritableSignal<string | null>;

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
    mockSubmission = signal<SubmissionResponse | null>(null);
    mockFeedback = signal<TaskFeedback | null>(null);
    mockSubmissionStatus = signal(null);

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

    mockStore.selectSignal.mockReturnValue(signal('default'));

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

    Object.defineProperty(component, 'taskId', { get: () => mockTaskId });
    Object.defineProperty(component, 'userAnswer', { get: () => mockUserAnswer });
    Object.defineProperty(component, 'submissionStatus', { get: () => mockSubmissionStatus });
    Object.defineProperty(component, 'submission', { get: () => mockSubmission });
    Object.defineProperty(component, 'feedback', { get: () => mockFeedback });
    Object.defineProperty(component, 'xpReward', { get: () => mockXpReward });
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

  describe('submitTask', () => {
    it('should submit task with valid data', () => {
      mockTaskId.set('task-123');
      mockUserAnswer.set('Test answer');
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

      component.submitTask();

      expect(dispatchSpy).toHaveBeenCalledWith(
        WrittenResponseActions.submitWrittenResponseTask({
          taskId: 'task-123',
          answer: 'Test answer',
        }),
      );
    });

    it('should show error when taskId is missing', () => {
      mockTaskId.set(null);
      const toastSpy = jest.spyOn(mockToastService, 'showError');

      component.submitTask();

      expect(toastSpy).toHaveBeenCalledWith('Error', 'Task ID is missing');
    });

    it('should show error when answer is empty', () => {
      mockTaskId.set('task-123');
      mockUserAnswer.set('');
      const toastSpy = jest.spyOn(mockToastService, 'showError');

      component.submitTask();

      expect(toastSpy).toHaveBeenCalledWith('Error', 'Please provide an answer before submitting');
    });
  });

  describe('getModalTitle', () => {
    it('should return "Task Complete!" for completed correct submission', () => {
      mockSubmissionStatus.set('COMPLETED');
      mockSubmission.set({
        id: 'sub-1',
        submissionId: 'sub-1',
        status: 'COMPLETED',
        isCorrect: true,
      });

      expect(component.getModalTitle()).toBe('Task Complete!');
    });

    it('should return "Task Failed!" for completed incorrect submission', () => {
      mockSubmissionStatus.set('COMPLETED');
      mockSubmission.set({
        id: 'sub-1',
        submissionId: 'sub-1',
        status: 'COMPLETED',
        isCorrect: false,
      });

      expect(component.getModalTitle()).toBe('Task Failed!');
    });

    it('should return "Processing Submission" for pending status', () => {
      mockSubmissionStatus.set('PENDING');

      expect(component.getModalTitle()).toBe('Processing Submission');
    });

    it('should return "Processing Submission" for in progress status', () => {
      mockSubmissionStatus.set('IN_PROGRESS');

      expect(component.getModalTitle()).toBe('Processing Submission');
    });

    it('should return "Task Submitted" for default case', () => {
      mockSubmissionStatus.set('UNKNOWN');

      expect(component.getModalTitle()).toBe('Task Submitted');
    });
  });

  describe('getModalMessage', () => {
    it('should return success message for correct submission', () => {
      mockSubmissionStatus.set('COMPLETED');
      mockSubmission.set({
        id: 'sub-1',
        submissionId: 'sub-1',
        status: 'COMPLETED',
        isCorrect: true,
        scoreEarned: 100,
      });

      const result = component.getModalMessage();

      expect(result).toContain('Congratulations!');
      expect(result).toContain('+100 XP');
    });

    it('should return failure message with feedback for incorrect submission', () => {
      mockSubmissionStatus.set('COMPLETED');
      mockSubmission.set({
        id: 'sub-1',
        submissionId: 'sub-1',
        status: 'COMPLETED',
        isCorrect: false,
      });
      mockFeedback.set({
        evaluation: {
          overall: {
            totalScore: 60,
            maxXP: 100,
            percentage: 60,
            summary: 'Good effort but needs improvement',
            keyImprovements: ['Better structure', 'More examples'],
          },
        },
      });
      mockXpReward.set(100);

      const result = component.getModalMessage();

      expect(result).toContain('Score: 60/100');
      expect(result).toContain('(60%)');
      expect(result).toContain('Good effort but needs improvement');
      expect(result).toContain('Better structure');
      expect(result).toContain('More examples');
    });

    it('should return processing message for pending status', () => {
      mockSubmissionStatus.set('PENDING');

      const result = component.getModalMessage();

      expect(result).toBe('Getting feedback on your submission. This may take a moment...');
    });

    it('should return processing message for in progress status', () => {
      mockSubmissionStatus.set('IN_PROGRESS');

      const result = component.getModalMessage();

      expect(result).toBe('Getting feedback on your submission. This may take a moment...');
    });

    it('should return default message for unknown status', () => {
      mockSubmissionStatus.set('UNKNOWN');

      const result = component.getModalMessage();

      expect(result).toBe('Your response has been submitted successfully!');
    });
  });

  describe('navigation methods', () => {
    it('should navigate to tasks dashboard on task complete', () => {
      const routerSpy = jest.spyOn(mockRouter, 'navigateByUrl');

      component.onTaskComplete();

      expect(routerSpy).toHaveBeenCalledWith('/dashboard/tasks');
    });

    it('should navigate to tasks dashboard on back to dashboard', () => {
      const routerSpy = jest.spyOn(mockRouter, 'navigateByUrl');

      component.onBackToDashboard();

      expect(routerSpy).toHaveBeenCalledWith('/dashboard/tasks');
    });
  });
});
