import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { signal } from '@angular/core';
import { CodingAssessment } from './coding-assessment';
import { Task, TaskType, TaskContentType, TaskDifficulty } from '@app/core/models/tasks-model';
import * as TasksActions from '@app/store/tasks/tasks.actions';

describe('CodingAssessment', () => {
  let component: CodingAssessment;
  let fixture: ComponentFixture<CodingAssessment>;
  let mockStore: Partial<Store>;
  let mockRoute: Partial<ActivatedRoute>;

  const mockTask: Task = {
    id: 't1',
    title: 'Test Task',
    description: 'Test description',
    type: TaskType.CODING,
    difficulty: TaskDifficulty.BEGINNER,
    content: {
      contentType: TaskContentType.CODING,
      prompt: 'Test prompt',
      examples: [],
      constraints: 'Test constraints',
      starterCode: 'console.log("test");',
      testCases: [],
      evaluationCriteria: {
        correctness: [],
        efficiency: [],
        style: [],
      },
      hints: [],
    },
    xpReward: 50,
    estimatedDuration: 15,
    skillName: 'JavaScript',
    version: 1,
  };

  beforeEach(async () => {
    mockStore = {
      selectSignal: jest.fn().mockReturnValue(signal(mockTask)),
      dispatch: jest.fn(),
    };

    const mockParamMap = {
      get: jest.fn().mockReturnValue('t1'),
    };

    mockRoute = {
      snapshot: {
        paramMap: mockParamMap,
      } as unknown as ActivatedRouteSnapshot,
    };

    await TestBed.configureTestingModule({
      imports: [CodingAssessment],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingAssessment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with assessmentStarted as false', () => {
    expect(component.assessmentStarted()).toBe(false);
  });

  it('should dispatch loadCurrentTask on init', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(TasksActions.loadCurrentTask({ taskId: 't1' }));
  });

  it('should set assessmentStarted to true and start timer when onStartTask is called', () => {
    component.onStartTask();
    expect(component.assessmentStarted()).toBe(true);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TasksActions.startTimer({ durationMinutes: 15, taskId: 't1' }),
    );
  });

  it('should update user code when onCodeChanged is called', () => {
    const newCode = 'console.log("new code");';
    component.onCodeChanged(newCode);
    expect(component.userCode()).toBe(newCode);
  });

  it('should dispatch clearCurrentTask on destroy', () => {
    component.ngOnDestroy();
    expect(mockStore.dispatch).toHaveBeenCalledWith(TasksActions.clearCurrentTask());
  });
});
