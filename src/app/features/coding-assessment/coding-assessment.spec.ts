import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { signal } from '@angular/core';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { CodingAssessment } from './coding-assessment';
import { Task, TaskType, TaskContentType, TaskDifficulty } from '@app/core/models/tasks-model';
import { CodeExecutionResult, TestCaseResult } from './models/coding-assessment.model';
import { selectCurrentTask } from '@app/store/tasks/tasks.selectors';
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
      selectSignal: jest.fn().mockImplementation(() => {
        return signal(null);
      }),
      dispatch: jest.fn(),
    };

    (mockStore.selectSignal as jest.Mock).mockImplementation(
      (selector: (state: object) => unknown) => {
        if (selector.toString().includes('currentTask')) return signal(mockTask);
        if (selector.toString().includes('loading')) return signal(false);
        if (selector.toString().includes('timer')) return signal(false);
        if (selector.toString().includes('userCode')) return signal('');
        if (selector.toString().includes('languageId')) return signal(63);
        if (selector.toString().includes('output'))
          return signal(null as CodeExecutionResult | null);
        if (selector.toString().includes('testResults')) return signal([] as TestCaseResult[]);
        if (selector.toString().includes('executing')) return signal(false);
        if (selector.toString().includes('submitting')) return signal(false);
        return signal(null);
      },
    );

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
        { provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} },
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

  it('should update user code when onCodeChanged is called', () => {
    const newCode = 'console.log("new code");';
    component.onCodeChanged(newCode);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TasksActions.updateUserCode({ code: newCode, taskId: 't1' }),
    );
  });

  it('should dispatch clearCurrentTask on destroy', () => {
    component.ngOnDestroy();
    expect(mockStore.dispatch).toHaveBeenCalledWith(TasksActions.clearCurrentTask());
  });
});
