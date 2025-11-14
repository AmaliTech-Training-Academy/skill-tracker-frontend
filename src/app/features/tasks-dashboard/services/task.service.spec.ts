import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { TaskService } from './task.service';
import { ApiService } from '../../../core/services/api/api-service';
import { ErrorHandlerService } from '../../../core/services/error/error-handler';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { ApiResponse } from '@app/core';
import {
  GroupedTasksResponse,
  Task,
  TaskPaginationParams,
  SuggestedTasksParams,
  TaskType,
  TaskDifficulty,
  TaskContentType,
  CodingTaskContent,
} from '../../../core/models/tasks-model';

describe('TaskService', () => {
  let service: TaskService;
  let apiService: jest.Mocked<ApiService>;
  let errorHandler: jest.Mocked<ErrorHandlerService>;

  const mockGroupedTasksResponse: ApiResponse<GroupedTasksResponse> = {
    success: true,
    message: 'Tasks retrieved successfully',
    data: {
      pending: {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 0,
        totalPages: 1,
        first: true,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 0,
        empty: true,
      },
      completed: {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 0,
        totalPages: 1,
        first: true,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 0,
        empty: true,
      },
    },
    metadata: { traceId: 'test-trace', timestamp: '2024-01-01T00:00:00Z' },
  };

  const mockTaskContent: CodingTaskContent = {
    contentType: TaskContentType.CODING,
    prompt: 'Test prompt',
    hints: ['Test hint'],
    examples: [{ input: 'test input', output: 'test output' }],
    constraints: 'Test constraints',
    starterCode: 'console.log("test");',
    testCases: [
      {
        input: 'test',
        expectedOutput: 'test',
        isHidden: false,
        description: 'Test case',
      },
    ],
    evaluationCriteria: {
      correctness: ['Test correctness'],
      efficiency: ['Test efficiency'],
      style: ['Test style'],
    },
  };

  const mockTask: Task = {
    id: 'test-id',
    title: 'Test Task',
    description: 'Test Description',
    type: TaskType.CODING,
    difficulty: TaskDifficulty.BEGINNER,
    content: mockTaskContent,
    xpReward: 100,
    estimatedDuration: 30,
    skillName: 'JAVASCRIPT',
    version: 1,
  };

  beforeEach(() => {
    const apiServiceMock = {
      get: jest.fn(),
    };

    const errorHandlerMock = {
      logError: jest.fn(),
      getError: jest.fn().mockReturnValue(new Error('Test error')),
    };

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerMock },
      ],
    });

    service = TestBed.inject(TaskService);
    apiService = TestBed.inject(ApiService) as jest.Mocked<ApiService>;
    errorHandler = TestBed.inject(ErrorHandlerService) as jest.Mocked<ErrorHandlerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTasks', () => {
    it('should call API with default parameters', () => {
      apiService.get.mockReturnValue(of(mockGroupedTasksResponse));

      service.getAllTasks().subscribe();

      const expectedParams = new HttpParams()
        .set('pendingPage', '0')
        .set('pendingSize', '10')
        .set('completedPage', '0')
        .set('completedSize', '10');

      expect(apiService.get).toHaveBeenCalledWith(APP_CONSTANTS.API_ENDPOINTS.MY_TASKS, {
        params: expectedParams,
      });
    });

    it('should call API with custom parameters', () => {
      const params: TaskPaginationParams = {
        pendingPage: 1,
        pendingSize: 5,
        completedPage: 2,
        completedSize: 15,
      };
      apiService.get.mockReturnValue(of(mockGroupedTasksResponse));

      service.getAllTasks(params).subscribe();

      const expectedParams = new HttpParams()
        .set('pendingPage', '1')
        .set('pendingSize', '5')
        .set('completedPage', '2')
        .set('completedSize', '15');

      expect(apiService.get).toHaveBeenCalledWith(APP_CONSTANTS.API_ENDPOINTS.MY_TASKS, {
        params: expectedParams,
      });
    });

    it('should return grouped tasks response', (done) => {
      apiService.get.mockReturnValue(of(mockGroupedTasksResponse));

      service.getAllTasks().subscribe((response) => {
        expect(response).toEqual(mockGroupedTasksResponse);
        done();
      });
    });

    it('should handle errors', (done) => {
      const error = new Error('API Error');
      apiService.get.mockReturnValue(throwError(() => error));

      service.getAllTasks().subscribe({
        error: (err) => {
          expect(errorHandler.logError).toHaveBeenCalledWith(error);
          expect(errorHandler.getError).toHaveBeenCalledWith(error);
          done();
        },
      });
    });
  });

  describe('getSuggestedTasks', () => {
    const mockSuggestedTasksResponse: ApiResponse<Task[]> = {
      success: true,
      message: 'Suggested tasks retrieved',
      data: [mockTask],
      metadata: { traceId: 'test-trace', timestamp: '2024-01-01T00:00:00Z' },
    };

    it('should call API with correct parameters', () => {
      const params: SuggestedTasksParams = {
        skillName: 'JAVASCRIPT',
        taskType: TaskType.CODING,
        limit: 3,
      };
      apiService.get.mockReturnValue(of(mockSuggestedTasksResponse));

      service.getSuggestedTasks(params).subscribe();

      const expectedParams = new HttpParams()
        .set('skillName', 'JAVASCRIPT')
        .set('taskType', 'CODING')
        .set('limit', '3');

      expect(apiService.get).toHaveBeenCalledWith(APP_CONSTANTS.API_ENDPOINTS.TASKS, {
        params: expectedParams,
      });
    });

    it('should use default limit when not provided', () => {
      const params: SuggestedTasksParams = {
        skillName: 'PYTHON',
        taskType: TaskType.ESSAY,
      };
      apiService.get.mockReturnValue(of(mockSuggestedTasksResponse));

      service.getSuggestedTasks(params).subscribe();

      const expectedParams = new HttpParams()
        .set('skillName', 'PYTHON')
        .set('taskType', 'ESSAY')
        .set('limit', '5');

      expect(apiService.get).toHaveBeenCalledWith(APP_CONSTANTS.API_ENDPOINTS.TASKS, {
        params: expectedParams,
      });
    });

    it('should return suggested tasks', (done) => {
      const params: SuggestedTasksParams = {
        skillName: 'JAVASCRIPT',
        taskType: TaskType.CODING,
      };
      apiService.get.mockReturnValue(of(mockSuggestedTasksResponse));

      service.getSuggestedTasks(params).subscribe((response) => {
        expect(response).toEqual(mockSuggestedTasksResponse);
        done();
      });
    });

    it('should handle errors', (done) => {
      const params: SuggestedTasksParams = {
        skillName: 'JAVASCRIPT',
        taskType: TaskType.CODING,
      };
      const error = new Error('API Error');
      apiService.get.mockReturnValue(throwError(() => error));

      service.getSuggestedTasks(params).subscribe({
        error: (err) => {
          expect(errorHandler.logError).toHaveBeenCalledWith(error);
          expect(errorHandler.getError).toHaveBeenCalledWith(error);
          done();
        },
      });
    });
  });

  describe('getTaskById', () => {
    const mockTaskResponse: ApiResponse<Task> = {
      success: true,
      message: 'Task retrieved',
      data: mockTask,
      metadata: { traceId: 'test-trace', timestamp: '2024-01-01T00:00:00Z' },
    };

    it('should call API with correct endpoint', () => {
      const taskId = 'test-task-id';
      apiService.get.mockReturnValue(of(mockTaskResponse));

      service.getTaskById(taskId).subscribe();

      expect(apiService.get).toHaveBeenCalledWith(`${APP_CONSTANTS.API_ENDPOINTS.TASKS}/${taskId}`);
    });

    it('should return task by id', (done) => {
      const taskId = 'test-task-id';
      apiService.get.mockReturnValue(of(mockTaskResponse));

      service.getTaskById(taskId).subscribe((response) => {
        expect(response).toEqual(mockTaskResponse);
        done();
      });
    });

    it('should handle errors', (done) => {
      const taskId = 'test-task-id';
      const error = new Error('API Error');
      apiService.get.mockReturnValue(throwError(() => error));

      service.getTaskById(taskId).subscribe({
        error: (err) => {
          expect(errorHandler.logError).toHaveBeenCalledWith(error);
          expect(errorHandler.getError).toHaveBeenCalledWith(error);
          done();
        },
      });
    });
  });
});
