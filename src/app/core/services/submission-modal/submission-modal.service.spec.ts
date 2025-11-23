import { SubmissionModalService } from './submission-modal.service';
import * as TasksActions from '../../../store/tasks/tasks.actions';
import { Store } from '@ngrx/store';

describe('SubmissionModalService', () => {
  let service: SubmissionModalService;
  let mockStore: Partial<Store>;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
    };

    service = new SubmissionModalService(mockStore as Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('retryFeedback', () => {
    it('should dispatch retryFeedback action', () => {
      const submissionId = 'sub-123';

      service.retryFeedback(submissionId);

      expect(mockStore.dispatch).toHaveBeenCalledWith(TasksActions.retryFeedback({ submissionId }));
    });
  });

  describe('retrySubmission', () => {
    it('should dispatch retrySubmission action', () => {
      const taskId = 'task-123';
      const code = 'console.log("test");';
      const languageId = 63;

      service.retrySubmission(taskId, code, languageId);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        TasksActions.retrySubmission({ taskId, code, languageId }),
      );
    });
  });

  describe('clearSubmission', () => {
    it('should dispatch clearSubmissionResult action', () => {
      service.clearSubmission();

      expect(mockStore.dispatch).toHaveBeenCalledWith(TasksActions.clearSubmissionResult());
    });
  });
});
