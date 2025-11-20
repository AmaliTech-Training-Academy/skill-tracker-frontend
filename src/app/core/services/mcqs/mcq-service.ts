import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import { McqRetrieveRequest, McqResponse } from '@app/core/models/mcq-model';
import { McqMockService } from '@app/features/multiple-choice/mcq-mock.service';

import { APP_CONSTANTS } from '@app/core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class McqGenerationService {
  private readonly USE_MOCK = true;
  constructor(
    private readonly api: ApiService,
    private readonly mockService: McqMockService
  ) {}

  public generateQuiz(payload: McqRetrieveRequest): Observable<McqResponse> {

    if (this.USE_MOCK) {
      return this.mockService.generateQuiz(payload.taskId);
    }
    
    return this.api.post<McqResponse>(APP_CONSTANTS.API_ENDPOINTS.GENERATE_MCQ, payload);
  }
}
