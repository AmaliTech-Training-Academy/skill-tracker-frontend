import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import { McqGenerationRequest, McqResponse } from '@app/core/models/mcq-model';

import { APP_CONSTANTS } from '@app/core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class McqGenerationService {
  constructor(private readonly api: ApiService) {}

  public generateQuiz(payload: McqGenerationRequest): Observable<McqResponse> {
    return this.api.post<McqResponse>(APP_CONSTANTS.API_ENDPOINTS.GENERATE_MCQ, payload);
  }
}
