import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { TasksEffects } from './tasks.effects';
import { TaskService } from '@app/features/tasks-dashboard/services/task.service';
import { ToastService } from '@app/core/services/toast/toast-service';
import { Router } from '@angular/router';
import * as TasksActions from './tasks.actions';
import { selectCurrentTaskLanguageId } from './tasks.selectors';
import { TaskType, TaskDifficulty, TaskContentType } from '@app/core/models/tasks-model';

describe('TasksEffects', () => {
  let actions$: Observable<Action>;
  let effects: TasksEffects;
  let taskService: {
    getTaskById: jest.MockedFunction<TaskService['getTaskById']>;
    executeCode: jest.MockedFunction<TaskService['executeCode']>;
    submitTask: jest.MockedFunction<TaskService['submitTask']>;
  };
  let toastService: {
    showError: jest.MockedFunction<ToastService['showError']>;
    showSuccess: jest.MockedFunction<ToastService['showSuccess']>;
  };
  let router: {
    navigate: jest.MockedFunction<Router['navigate']>;
  };
  let store: MockStore;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    type: TaskType.CODING,
    difficulty: TaskDifficulty.BEGINNER,
    content: {
      contentType: TaskContentType.CODING as const,
      prompt: 'Test prompt',
      starterCode: 'console.log("test");',
      testCases: [],
      hints: [],
      examples: [],
      constraints: 'Test constraints',
      evaluationCriteria: { correctness: [], efficiency: [], style: [] },
    },
    xpReward: 100,
    estimatedDuration: 30,
    skillName: 'JavaScript',
    version: 1,
  };

  beforeEach(() => {
    const taskServiceSpy = {
      getTaskById: jest.fn(),
      executeCode: jest.fn(),
      submitTask: jest.fn(),
    };
    const toastServiceSpy = {
      showError: jest.fn(),
      showSuccess: jest.fn(),
    };
    const routerSpy = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TasksEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: selectCurrentTaskLanguageId, value: 97 }],
        }),
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    effects = TestBed.inject(TasksEffects);
    taskService = TestBed.inject(TaskService) as any;
    toastService = TestBed.inject(ToastService) as any;
    router = TestBed.inject(Router) as any;
    store = TestBed.inject(MockStore);
  });

  describe('loadCurrentTask$', () => {
    it('should return loadCurrentTaskSuccess on success', (done) => {
      const action = TasksActions.loadCurrentTask({ taskId: '1' });
      const response = {
        success: true,
        message: 'Task loaded',
        data: mockTask,
        metadata: { traceId: 'test', timestamp: '2024-01-01' },
      };

      taskService.getTaskById.mockReturnValue(of(response));
      actions$ = of(action);

      effects.loadCurrentTask$.subscribe((result) => {
        expect(result).toEqual(TasksActions.loadCurrentTaskSuccess({ task: mockTask }));
        expect(taskService.getTaskById).toHaveBeenCalledWith('1');
        done();
      });
    });

    it('should return loadCurrentTaskFailure on error', (done) => {
      const action = TasksActions.loadCurrentTask({ taskId: '1' });
      const error = new Error('API Error');

      taskService.getTaskById.mockReturnValue(throwError(() => error));
      actions$ = of(action);

      effects.loadCurrentTask$.subscribe((result) => {
        expect(result).toEqual(
          TasksActions.loadCurrentTaskFailure({ error: 'Failed to load task' }),
        );
        expect(toastService.showError).toHaveBeenCalledWith(
          'Task Load Error',
          'Failed to load task. Please try again.',
        );
        done();
      });
    });
  });

  describe('executeCode$', () => {
    it('should execute code with language ID from selector', (done) => {
      const action = TasksActions.executeCode({
        taskId: '1',
        code: 'console.log("test");',
        languageId: 97,
      });
      const response = {
        success: true,
        message: 'Code executed',
        data: {
          stdout: 'test',
          stderr: '',
          allTestsPassed: true,
          testsPassed: 1,
          testsTotal: 1,
          avgExecutionTimeMs: 100,
          avgMemoryUsedKb: 50,
          testResults: [],
        },
        metadata: { traceId: 'test', timestamp: '2024-01-01' },
      };

      taskService.executeCode.mockReturnValue(of(response));
      actions$ = of(action);

      effects.executeCode$.subscribe((result) => {
        expect(result).toEqual(
          TasksActions.executeCodeSuccess({
            result: {
              stdout: 'test',
              stderr: '',
              allTestsPassed: true,
              testsPassed: 1,
              testsTotal: 1,
              avgExecutionTimeMs: 100,
              avgMemoryUsedKb: 50,
              testResults: [],
            },
          }),
        );
        expect(taskService.executeCode).toHaveBeenCalledWith({
          taskId: '1',
          code: 'console.log("test");',
          languageId: 97,
        });
        done();
      });
    });

    it('should handle execute code error', (done) => {
      const action = TasksActions.executeCode({ taskId: '1', code: 'test', languageId: 97 });
      const error = new Error('Execution failed');

      taskService.executeCode.mockReturnValue(throwError(() => error));
      actions$ = of(action);

      effects.executeCode$.subscribe((result) => {
        expect(result).toEqual(
          TasksActions.executeCodeFailure({ error: 'Failed to execute code' }),
        );
        expect(toastService.showError).toHaveBeenCalledWith(
          'Execution Error',
          'Failed to execute code',
        );
        done();
      });
    });
  });

  describe('submitTaskSolution$', () => {
    it('should submit task solution with language ID from selector', (done) => {
      const action = TasksActions.submitTaskSolution({
        taskId: '1',
        code: 'solution',
        languageId: 97,
      });
      const response = {
        success: true,
        message: 'Solution submitted',
        data: { submissionId: 'sub123', status: 'COMPLETED' as const },
        metadata: { traceId: 'test', timestamp: '2024-01-01' },
      };

      taskService.submitTask.mockReturnValue(of(response));
      actions$ = of(action);

      effects.submitTaskSolution$.subscribe((result) => {
        expect(result).toEqual(TasksActions.submitTaskSolutionSuccess({ submissionId: 'sub123' }));
        expect(taskService.submitTask).toHaveBeenCalledWith({
          taskId: '1',
          answer: { answerType: 'CODE', code: 'solution', languageId: 97 },
        });
        expect(toastService.showSuccess).toHaveBeenCalledWith(
          'Success',
          'Solution submitted successfully',
        );
        done();
      });
    });

    it('should handle submit task error', (done) => {
      const action = TasksActions.submitTaskSolution({
        taskId: '1',
        code: 'solution',
        languageId: 97,
      });
      const error = new Error('Submit failed');

      taskService.submitTask.mockReturnValue(throwError(() => error));
      actions$ = of(action);

      effects.submitTaskSolution$.subscribe((result) => {
        expect(result).toEqual(
          TasksActions.submitTaskSolutionFailure({ error: 'Failed to submit solution' }),
        );
        expect(toastService.showError).toHaveBeenCalledWith(
          'Submission Error',
          'Failed to submit solution',
        );
        done();
      });
    });
  });
});
