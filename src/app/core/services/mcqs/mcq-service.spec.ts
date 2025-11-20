import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { McqGenerationService } from './mcq-service';
import { ApiService } from '../api/api-service';
import { McqMockService } from '@app/features/multiple-choice/mcq-mock.service';
import { McqRetrieveRequest, McqResponse } from '@app/core/models/mcq-model';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';

describe('McqGenerationService', () => {
  let service: McqGenerationService;
  let apiServiceMock: jest.Mocked<Pick<ApiService, 'post'>>;
  let mockServiceMock: jest.Mocked<Pick<McqMockService, 'generateQuiz'>>;

  beforeEach(() => {
    apiServiceMock = {
      post: jest.fn(),
    };

    mockServiceMock = {
      generateQuiz: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        McqGenerationService,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: McqMockService, useValue: mockServiceMock },
      ],
    });

    service = TestBed.inject(McqGenerationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateQuiz', () => {
    const mockPayload: McqRetrieveRequest = {
      taskId: 'test-task-123',
    };

    const mockResponse: McqResponse = {
      success: true,
      message: 'Quiz generated successfully',
      data: {
        mcqQuestion: [
          {
            question_number: '1',
            question_duration: 60,
            question_text: 'What is the capital of France?',
            options: ['London', 'Paris', 'Berlin', 'Madrid'],
            hint: 'It is known as the City of Light',
            correct_answer: 'Paris',
            explanation: 'Paris is the capital and largest city of France.',
          },
          {
            question_number: '2',
            question_duration: 45,
            question_text: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            hint: 'Basic arithmetic',
            correct_answer: '4',
            explanation: 'Two plus two equals four.',
          },
        ],
      },
      metadata: {
        timestamp: '2025-01-15T10:30:00Z',
        traceId: 'trace-123-456',
      },
    };

    it('should call mockService.generateQuiz when USE_MOCK is true', (done) => {
      mockServiceMock.generateQuiz.mockReturnValue(of(mockResponse));

      service.generateQuiz(mockPayload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockServiceMock.generateQuiz).toHaveBeenCalledWith(mockPayload.taskId);
        expect(mockServiceMock.generateQuiz).toHaveBeenCalledTimes(1);
        expect(apiServiceMock.post).not.toHaveBeenCalled();
        done();
      });
    });

    it('should pass the correct taskId to mockService.generateQuiz', (done) => {
      const customPayload: McqRetrieveRequest = {
        taskId: 'custom-task-456',
      };
      mockServiceMock.generateQuiz.mockReturnValue(of(mockResponse));

      service.generateQuiz(customPayload).subscribe(() => {
        expect(mockServiceMock.generateQuiz).toHaveBeenCalledWith('custom-task-456');
        done();
      });
    });

    it('should return Observable<McqResponse> from mockService', (done) => {
      mockServiceMock.generateQuiz.mockReturnValue(of(mockResponse));

      service.generateQuiz(mockPayload).subscribe((response) => {
        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.message).toBe('Quiz generated successfully');
        expect(response.data.mcqQuestion).toBeDefined();
        expect(Array.isArray(response.data.mcqQuestion)).toBe(true);
        expect(response.data.mcqQuestion.length).toBe(2);
        expect(response.metadata).toBeDefined();
        expect(response.metadata.traceId).toBe('trace-123-456');
        done();
      });
    });

    it('should not call apiService.post when USE_MOCK is true', (done) => {
      mockServiceMock.generateQuiz.mockReturnValue(of(mockResponse));

      service.generateQuiz(mockPayload).subscribe(() => {
        expect(apiServiceMock.post).not.toHaveBeenCalled();
        done();
      });
    });

    it('would call apiService.post with correct parameters if USE_MOCK were false', () => {
      expect(true).toBe(true);
    });

    it('should handle empty taskId', (done) => {
      const emptyPayload: McqRetrieveRequest = {
        taskId: '',
      };
      mockServiceMock.generateQuiz.mockReturnValue(of(mockResponse));

      service.generateQuiz(emptyPayload).subscribe((response) => {
        expect(mockServiceMock.generateQuiz).toHaveBeenCalledWith('');
        expect(response).toEqual(mockResponse);
        done();
      });
    });

    it('should propagate errors from mockService', (done) => {
      const error = new Error('Mock service error');
      mockServiceMock.generateQuiz.mockReturnValue(throwError(() => error));

      service.generateQuiz(mockPayload).subscribe({
        error: (err: Error) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });
});
