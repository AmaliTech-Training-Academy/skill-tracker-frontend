import { tasksReducer } from './tasks.reducer';
import { initialTasksState } from './tasks.state';
import * as TasksActions from './tasks.actions';
import { TaskType, TaskDifficulty, TaskContentType, Task } from '@app/core/models/tasks-model';

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
});
