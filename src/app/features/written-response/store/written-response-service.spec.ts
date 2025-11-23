import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WrittenResponseService } from './written-response-service';
import { ApiService, APP_CONSTANTS } from '@app/core';
import {
  WrittenResponseTask,
  WrittenResponseSubmission,
  WrittenResponseSubmissionResponse,
} from './written-response.state';
import { ApiResponse } from '@app/core';
import { SubmissionResponse } from '@app/core/models/tasks-model';
import { TaskFeedback } from '../written-response';

describe('WrittenResponseService', () => {
  let service: WrittenResponseService;
  let mockApiService: {
    get: jest.Mock;
    post: jest.Mock;
  };

  const mockTask: WrittenResponseTask = {
    taskId: 'task-123',
    taskDefinitionId: 'def-123',
    title: 'Test Task',
    description: 'Test Description',
    skillName: 'Writing',
    type: 'ESSAY',
    difficulty: 'Medium',
    content: {
      contentType: 'essay',
      prompt: 'Write about testing',
      detailedInstructions: 'Write detailed instructions',
      evaluationCriteria: { clarity: 'Clear writing' },
      rubric: { excellent: '90-100' },
      hints: ['Hint 1'],
      expectedLength: '500 words',
    },
    version: 1,
    isPublished: true,
    estimatedDurationInMinutes: 15,
    xpReward: 100,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockSubmission: WrittenResponseSubmission = {
    taskId: 'task-123',
    answer: {
      answerType: 'ESSAY',
      submissionText: 'Test submission',
    },
  };

  const mockSubmissionResponse: WrittenResponseSubmissionResponse = {
    success: true,
    message: 'Submission successful',
    data: {
      submissionId: 'sub-123',
      status: 'PENDING',
    },
    metadata: {
      traceId: 'trace-123',
      timestamp: '2024-01-01T00:00:00Z',
    },
  };

  const mockStatusResponse: ApiResponse<SubmissionResponse> = {
    success: true,
    message: 'Status retrieved',
    data: {
      id: 'sub-123',
      submissionId: 'sub-123',
      status: 'COMPLETED',
      isCorrect: true,
      scoreEarned: 100,
      feedback: {
        evaluation: {
          overall: {
            totalScore: 100,
            maxXP: 100,
            percentage: 100,
            summary: 'Excellent work!',
          },
        },
      },
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
    it('should fetch task by ID', () => {
      const expectedResponse = {
        data: mockTask,
        success: true,
        message: 'Task retrieved successfully',
      };

      mockApiService.get.mockReturnValue(of(expectedResponse));

      service.fetchWrittenResponseTask('task-123').subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${APP_CONSTANTS.API_ENDPOINTS.TASKS}/task-123`,
      );
    });

    it('should call correct API endpoint for task fetch', () => {
      mockApiService.get.mockReturnValue(of({}));

      service.fetchWrittenResponseTask('test-task-id');

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${APP_CONSTANTS.API_ENDPOINTS.TASKS}/test-task-id`,
      );
    });
  });

  describe('submitWrittenResponse', () => {
    it('should submit written response', () => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission).subscribe((response) => {
        expect(response).toEqual(mockSubmissionResponse);
      });

      expect(mockApiService.post).toHaveBeenCalledWith(
        APP_CONSTANTS.API_ENDPOINTS.SUBMIT,
        mockSubmission,
      );
    });

    it('should call correct API endpoint for submission', () => {
      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(mockSubmission);

      expect(mockApiService.post).toHaveBeenCalledWith(
        APP_CONSTANTS.API_ENDPOINTS.SUBMIT,
        mockSubmission,
      );
    });

    it('should handle submission with essay answer type', () => {
      const essaySubmission: WrittenResponseSubmission = {
        taskId: 'task-456',
        answer: {
          answerType: 'ESSAY',
          submissionText: 'My essay response',
        },
      };

      mockApiService.post.mockReturnValue(of(mockSubmissionResponse));

      service.submitWrittenResponse(essaySubmission).subscribe();

      expect(mockApiService.post).toHaveBeenCalledWith(
        APP_CONSTANTS.API_ENDPOINTS.SUBMIT,
        essaySubmission,
      );
    });
  });

  describe('getSubmissionStatus', () => {
    it('should get submission status by ID', () => {
      mockApiService.get.mockReturnValue(of(mockStatusResponse));

      service.getSubmissionStatus('sub-123').subscribe((response) => {
        expect(response).toEqual(mockStatusResponse);
      });

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${APP_CONSTANTS.API_ENDPOINTS.SUBMISSIONS}/sub-123`,
      );
    });

    it('should call correct API endpoint for status check', () => {
      mockApiService.get.mockReturnValue(of(mockStatusResponse));

      service.getSubmissionStatus('test-submission-id');

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${APP_CONSTANTS.API_ENDPOINTS.SUBMISSIONS}/test-submission-id`,
      );
    });

    it('should return submission response with feedback', () => {
      const responseWithFeedback = {
        ...mockStatusResponse,
        data: {
          ...mockStatusResponse.data,
          submissionId: 'sub-123',
          feedback: {
            evaluation: {
              overall: {
                totalScore: 85,
                maxXP: 100,
                percentage: 85,
                summary: 'Good work with room for improvement',
                keyImprovements: ['Better structure', 'More examples'],
              },
            },
          },
        },
      };

      mockApiService.get.mockReturnValue(of(responseWithFeedback));

      service.getSubmissionStatus('sub-123').subscribe(({ data }) => {
        expect(data.feedback).toBeDefined();
        expect((data.feedback as TaskFeedback)?.evaluation?.overall?.totalScore).toBe(85);
      });
    });
  });

  describe('API endpoint constants', () => {
    it('should use correct endpoints for all methods', () => {
      mockApiService.get.mockReturnValue(of({}));
      mockApiService.post.mockReturnValue(of({}));

      service.fetchWrittenResponseTask('task-1');
      expect(mockApiService.get).toHaveBeenCalledWith(
        expect.stringContaining(APP_CONSTANTS.API_ENDPOINTS.TASKS),
      );

      service.submitWrittenResponse(mockSubmission);
      expect(mockApiService.post).toHaveBeenCalledWith(
        APP_CONSTANTS.API_ENDPOINTS.SUBMIT,
        mockSubmission,
      );

      service.getSubmissionStatus('sub-1');
      expect(mockApiService.get).toHaveBeenCalledWith(
        expect.stringContaining(APP_CONSTANTS.API_ENDPOINTS.SUBMISSIONS),
      );
    });
  });
});
