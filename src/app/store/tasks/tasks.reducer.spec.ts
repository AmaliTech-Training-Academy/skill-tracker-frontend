import { tasksReducer } from './tasks.reducer';
import { initialTasksState } from './tasks.state';
import * as TasksActions from './tasks.actions';
import {
  TaskType,
  TaskDifficulty,
  TaskContentType,
  Task,
  SubmissionStatus,
} from '@app/core/models/tasks-model';

describe('Tasks Reducer', () => {
  const mockTask: Task = {
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

  describe('loadCurrentTask', () => {
    it('should set loading to true', () => {
      const action = TasksActions.loadCurrentTask({ taskId: '1' });
      const state = tasksReducer(initialTasksState, action);

      expect(state.currentTaskLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('loadCurrentTaskSuccess', () => {
    it('should set current task and stop loading', () => {
      const action = TasksActions.loadCurrentTaskSuccess({ task: mockTask });
      const state = tasksReducer(initialTasksState, action);

      expect(state.currentTask).toEqual(mockTask);
      expect(state.currentTaskLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('loadCurrentTaskFailure', () => {
    it('should set error and stop loading', () => {
      const action = TasksActions.loadCurrentTaskFailure({ error: 'Failed to load' });
      const state = tasksReducer(initialTasksState, action);

      expect(state.currentTask).toBe(null);
      expect(state.currentTaskLoading).toBe(false);
      expect(state.error).toBe('Failed to load');
    });
  });

  describe('clearCurrentTask', () => {
    it('should clear current task and reset timer', () => {
      const stateWithTask = {
        ...initialTasksState,
        currentTask: mockTask,
        userCode: 'console.log("test");',
        executionResult: {
          stdout: 'test',
          stderr: '',
          allTestsPassed: true,
          testsPassed: 1,
          testsTotal: 1,
          avgExecutionTimeMs: 100,
          avgMemoryUsedKb: 50,
          testResults: [],
        },
        timer: { isRunning: true, remainingSeconds: 100, endTime: 123456, taskId: '1' },
      };

      const action = TasksActions.clearCurrentTask();
      const state = tasksReducer(stateWithTask, action);

      expect(state.currentTask).toBe(null);
      expect(state.userCode).toBe('');
      expect(state.executionResult).toBe(null);
      expect(state.timer.isRunning).toBe(false);
      expect(state.timer.remainingSeconds).toBe(0);
      expect(state.timer.taskId).toBe(null);
    });
  });

  describe('executeCode', () => {
    it('should set codeExecuting to true', () => {
      const action = TasksActions.executeCode({ taskId: '1', code: 'test', languageId: 97 });
      const state = tasksReducer(initialTasksState, action);

      expect(state.codeExecuting).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('executeCodeSuccess', () => {
    it('should set execution result and stop executing', () => {
      const result = {
        stdout: 'Hello World',
        stderr: '',
        allTestsPassed: true,
        testsPassed: 1,
        testsTotal: 1,
        avgExecutionTimeMs: 50,
        avgMemoryUsedKb: 30,
        testResults: [],
      };
      const action = TasksActions.executeCodeSuccess({ result });
      const state = tasksReducer(initialTasksState, action);

      expect(state.codeExecuting).toBe(false);
      expect(state.executionResult).toEqual(result);
      expect(state.error).toBe(null);
    });
  });

  describe('updateUserCode', () => {
    it('should update user code', () => {
      const action = TasksActions.updateUserCode({ code: 'console.log("test");', taskId: '1' });
      const state = tasksReducer(initialTasksState, action);

      expect(state.userCode).toBe('console.log("test");');
    });
  });

  describe('startTimer', () => {
    it('should start timer with correct values', () => {
      const action = TasksActions.startTimer({ durationMinutes: 30, taskId: '1' });
      const state = tasksReducer(initialTasksState, action);

      expect(state.timer.isRunning).toBe(true);
      expect(state.timer.remainingSeconds).toBe(1800);
      expect(state.timer.taskId).toBe('1');
      expect(state.timer.endTime).toBeGreaterThan(Date.now());
    });

    it('should not restart timer if already running for same task', () => {
      const stateWithTimer = {
        ...initialTasksState,
        timer: { isRunning: true, remainingSeconds: 900, endTime: 123456, taskId: '1' },
      };

      const action = TasksActions.startTimer({ durationMinutes: 30, taskId: '1' });
      const state = tasksReducer(stateWithTimer, action);

      expect(state.timer.remainingSeconds).toBe(900);
    });
  });

  describe('submitTaskSolution', () => {
    it('should set submitting to true', () => {
      const action = TasksActions.submitTaskSolution({ taskId: '1', code: 'test', languageId: 63 });
      const state = tasksReducer(initialTasksState, action);

      expect(state.submitting).toBe(true);
      expect(state.submissionState.status).toBe(SubmissionStatus.SUBMITTING);
      expect(state.error).toBe(null);
    });
  });

  describe('submitTaskSolutionSuccess', () => {
    it('should set submission result and stop submitting', () => {
      const action = TasksActions.submitTaskSolutionSuccess({
        submissionId: 'sub-123',
        xpEarned: 100,
      });
      const state = tasksReducer(initialTasksState, action);

      expect(state.submitting).toBe(false);
      expect(state.submissionResult).toEqual({
        success: true,
        submissionId: 'sub-123',
        xpEarned: 100,
      });
      expect(state.submissionState.status).toBe(SubmissionStatus.PROCESSING);
      expect(state.submissionState.submissionId).toBe('sub-123');
      expect(state.error).toBe(null);
    });
  });

  describe('submitTaskSolutionFailure', () => {
    it('should set error and stop submitting', () => {
      const action = TasksActions.submitTaskSolutionFailure({ error: 'Submission failed' });
      const state = tasksReducer(initialTasksState, action);

      expect(state.submitting).toBe(false);
      expect(state.submissionResult).toEqual({ success: false, error: 'Submission failed' });
      expect(state.submissionState.status).toBe(SubmissionStatus.ERROR);
      expect(state.submissionState.canRetry).toBe(true);
      expect(state.error).toBe('Submission failed');
    });
  });

  describe('getSubmissionStatusSuccess', () => {
    it('should update submission state with completed status', () => {
      const submission = {
        id: 'sub-123',
        submissionId: 'sub-123',
        status: 'COMPLETED' as const,
        feedback: { score: 85 },
        isCorrect: true,
      };
      const action = TasksActions.getSubmissionStatusSuccess({ submission });
      const state = tasksReducer(initialTasksState, action);

      expect(state.submissionState.status).toBe(SubmissionStatus.COMPLETED);
      expect(state.submissionState.feedback).toEqual({ score: 85 });
      expect(state.submissionState.canRetry).toBe(false);
    });
  });

  describe('clearSubmissionResult', () => {
    it('should clear submission result only', () => {
      const stateWithSubmission = {
        ...initialTasksState,
        submissionResult: { success: true, submissionId: 'sub-123', xpEarned: 100 },
        submissionState: {
          status: SubmissionStatus.COMPLETED,
          submissionId: 'sub-123',
          canRetry: false,
          feedback: { score: 85 },
        },
      };

      const action = TasksActions.clearSubmissionResult();
      const state = tasksReducer(stateWithSubmission, action);

      expect(state.submissionResult).toBe(null);
      // submissionState is not reset by clearSubmissionResult
      expect(state.submissionState.status).toBe(SubmissionStatus.COMPLETED);
    });
  });
});
