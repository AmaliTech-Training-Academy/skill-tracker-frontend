import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TasksActions from '@app/store/tasks/tasks.actions';

export type SubmissionModalType = 'confirm' | 'processing' | 'completed' | 'failed' | 'error';

export interface SubmissionModalData {
  type: SubmissionModalType;
  xpEarned?: number;
  error?: string;
  submissionId?: string;
  taskId?: string;
  code?: string;
  languageId?: number;
  feedback?: { message?: string; details?: string; score?: number };
}

@Injectable({
  providedIn: 'root',
})
export class SubmissionModalService {
  constructor(private store: Store) {}

  public retryFeedback(submissionId: string): void {
    this.store.dispatch(TasksActions.retryFeedback({ submissionId }));
  }

  public retrySubmission(taskId: string, code: string, languageId: number): void {
    this.store.dispatch(TasksActions.retrySubmission({ taskId, code, languageId }));
  }

  public clearSubmission(): void {
    this.store.dispatch(TasksActions.clearSubmissionResult());
  }
}
