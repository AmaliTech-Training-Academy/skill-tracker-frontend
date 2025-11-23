import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WrittenResponseService } from './written-response-service';
import { ApiService, APP_CONSTANTS } from '@app/core';
import {
  WrittenResponseTask,
  WrittenResponseSubmission,
  WrittenResponseSubmissionResponse,
} from './written-response.state';

describe('WrittenResponseService', () => {
  let service: WrittenResponseService;
  let mockApiService: {
    get: jest.Mock;
    post: jest.Mock;
  };

  const mockTask: WrittenResponseTask = {
    taskId: 'task-123',
    taskDefinitionId: 'def-456',
    title: 'Test Task',
    description: 'Test Description',
    skillName: 'Writing',
    type: 'WRITTEN_RESPONSE',
    difficulty: 'Medium',
    content: {
      contentType: 'essay',
      prompt: 'Write your response',
      detailedInstructions: 'Be detailed',
      evaluationCriteria: {},
      rubric: {},
      hints: ['Hint 1'],
      expectedLength: '500 words',
    },
    version: 1,
    isPublished: true,
    estimatedDurationInMinutes: 30,
    xpReward: 100,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockTaskResponse = {
    data: mockTask,
    success: true,
    message: 'Task retrieved successfully',
  };

  const mockSubmission: WrittenResponseSubmission = {
    taskId: 'task-123',
    answer: {
      answerType: 'ESSAY',
      submissionText: 'My answer text',
    },
  };

  const mockSubmissionResponse: WrittenResponseSubmissionResponse = {
    success: true,
    message: 'Submission accepted for evaluation.',
    data: {
      submissionId: '6fc824bb-87d6-4836-9a69-84bd4a31e15b',
      status: 'PENDING',
    },
    metadata: {
      traceId: 'trace-123',
      timestamp: '2025-11-22T12:16:48.418291549Z',
    },
  };

  beforeEach(() => {
    mockApiService = {
      get: jest.fn(),
      post: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [WrittenResponseService, { provide: ApiService, useValue: mockApiService }],
    });

    service = TestBed.inject(WrittenResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchWrittenResponseTask', () => {
    it('should fetch task with correct URL', (done) => {
      const taskId = 'task-123';
      const expectedUrl = `${APP_CONSTANTS.API_ENDPOINTS.TASKS}/${taskId}`;

      mockApiService.get.mockReturnValue(of(mockTaskResponse));

      service.fetchWrittenResponseTask(taskId).subscribe((response) => {
        expect(mockApiService.get).toHaveBeenCalledWith(expectedUrl);
        expect(response).toEqual(mockTaskResponse);
        expect(response.data).toEqual(mockTask);
        expect(response.success).toBe(true);
        done();
      });
    });

    it('should return task data with correct structure', (done) => {
      mockApiService.get.mockReturnValue(of(mockTaskResponse));

      service.fetchWrittenResponseTask('task-123').subscribe((response) => {
        expect(response.data.taskId).toBe('task-123');
        expect(response.data.title).toBe('Test Task');
        expect(response.data.xpReward).toBe(100);
        expect(response.success).toBe(true);
        expect(response.message).toBe('Task retrieved successfully');
        done();
      });
    });

    it('should handle different taskIds', (done) => {
      const taskId = 'different-task-456';
      const expectedUrl = `${APP_CONSTANTS.API_ENDPOINTS.TASKS}/${taskId}`;

      mockApiService.get.mockReturnValue(of(mockTaskResponse));

      service.fetchWrittenResponseTask(taskId).subscribe(() => {
        expect(mockApiService.get).toHaveBeenCalledWith(expectedUrl);
        done();
      });
    });

    it('should call ApiService.get exactly once', (done) => {
      mockApiService.get.mockReturnValue(of(mockTaskResponse));

      service.fetchWrittenResponseTask('task-123').subscribe(() => {
        expect(mockApiService.get).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should return observable that can be subscribed to', () => {
      mockApiService.get.mockReturnValue(of(mockTaskResponse));

      const result = service.fetchWrittenResponseTask('task-123');

      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });
  });

  describe('submitWrittenResponse', () => {
    it('should submit response with correct URL and payload', (done) => {
      const expectedUrl = `${APP_CONSTANTS.API_ENDPOINTS.SUBMIT}`;

      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe((response) => {
        expect(mockApiService.post).toHaveBeenCalledWith(expectedUrl, mockSubmission);
        expect(response).toEqual(mockSubmissionResponse);
        done();
      });
    });

    it('should return submission response with correct structure', (done) => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.message).toBe('Submission accepted for evaluation.');
        expect(response.data.submissionId).toBe('6fc824bb-87d6-4836-9a69-84bd4a31e15b');
        expect(response.data.status).toBe('PENDING');
        expect(response.metadata.traceId).toBe('trace-123');
        done();
      });
    });

    it('should pass correct submission object', (done) => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe(() => {
        const callArgs = mockApiService.post.mock.calls[0];
        const passedSubmission = callArgs[1] as WrittenResponseSubmission;

        expect(passedSubmission.taskId).toBe('task-123');
        expect(passedSubmission.answer.answerType).toBe('ESSAY');
        expect(passedSubmission.answer.submissionText).toBe('My answer text');
        done();
      });
    });

    it('should handle different submission payloads', (done) => {
      const differentSubmission: WrittenResponseSubmission = {
        taskId: 'task-789',
        answer: {
          answerType: 'ESSAY',
          submissionText: 'Different answer',
        },
      };

      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(differentSubmission).subscribe(() => {
        expect(mockApiService.post).toHaveBeenCalledWith(
          APP_CONSTANTS.API_ENDPOINTS.SUBMIT,
          differentSubmission,
        );
        done();
      });
    });

    it('should call ApiService.post exactly once', (done) => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe(() => {
        expect(mockApiService.post).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should return observable that can be subscribed to', () => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      const result = service.submitWrittenResponse(mockSubmission);

      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should submit with ESSAY answer type', (done) => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe(() => {
        const callArgs = mockApiService.post.mock.calls[0];
        const passedSubmission = callArgs[1] as WrittenResponseSubmission;

        expect(passedSubmission.answer.answerType).toBe('ESSAY');
        done();
      });
    });

    it('should include metadata in response', (done) => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe((response) => {
        expect(response.metadata).toBeDefined();
        expect(response.metadata.traceId).toBeDefined();
        expect(response.metadata.timestamp).toBeDefined();
        done();
      });
    });
  });

  describe('API endpoint configuration', () => {
    it('should use correct TASKS endpoint', (done) => {
      mockApiService.get.mockReturnValue(of(mockTaskResponse));

      service.fetchWrittenResponseTask('test-id').subscribe(() => {
        const calledUrl = mockApiService.get.mock.calls[0][0] as string;
        expect(calledUrl).toContain(APP_CONSTANTS.API_ENDPOINTS.TASKS);
        done();
      });
    });

    it('should use correct SUBMIT endpoint', (done) => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe(() => {
        const calledUrl = mockApiService.post.mock.calls[0][0] as string;
        expect(calledUrl).toBe(APP_CONSTANTS.API_ENDPOINTS.SUBMIT);
        done();
      });
    });
  });

  describe('Service instantiation', () => {
    it('should inject ApiService', () => {
      expect(service['api']).toBeDefined();
    });

    it('should be provided in root', () => {
      const metadata = (WrittenResponseService as unknown as { ɵprov?: { providedIn: string } })
        .ɵprov;
      expect(metadata?.providedIn).toBe('root');
    });
  });
});
