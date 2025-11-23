import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  WrittenResponseTask,
  WrittenResponseSubmission,
  WrittenResponseSubmissionResponse,
} from './written-response.state';
import { ApiService } from '@app/core';
import { APP_CONSTANTS } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class WrittenResponseService {
  constructor(private readonly api: ApiService) {}

  public fetchWrittenResponseTask(
    taskId: string,
  ): Observable<{ data: WrittenResponseTask; success: boolean; message: string }> {
    const url = `${APP_CONSTANTS.API_ENDPOINTS.TASKS}/${taskId}`;
    return this.api.get<{ data: WrittenResponseTask; success: boolean; message: string }>(url);
  }

  public submitWrittenResponse(
    submission: WrittenResponseSubmission,
  ): Observable<WrittenResponseSubmissionResponse> {
    const url = `${APP_CONSTANTS.API_ENDPOINTS.SUBMIT}`;
    return this.api.post<WrittenResponseSubmissionResponse>(url, submission);
  }
}
