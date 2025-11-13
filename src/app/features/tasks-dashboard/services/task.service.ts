import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  GroupedTasksResponse,
  Task,
  TaskPaginationParams,
  SuggestedTasksParams,
} from '../../../core/models/tasks-model';
import { ApiResponse } from '../../../core/models/api.model';
import { ApiService } from '../../../core/services/api/api-service';
import { ErrorHandlerService } from '../../../core/services/error/error-handler';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private apiService: ApiService,
    private errorHandler: ErrorHandlerService,
  ) {}

  public getAllTasks(
    params: TaskPaginationParams = {},
  ): Observable<ApiResponse<GroupedTasksResponse>> {
    const httpParams = new HttpParams()
      .set('pendingPage', (params.pendingPage ?? 0).toString())
      .set('pendingSize', (params.pendingSize ?? 10).toString())
      .set('completedPage', (params.completedPage ?? 0).toString())
      .set('completedSize', (params.completedSize ?? 10).toString());

    return this.apiService
      .get<
        ApiResponse<GroupedTasksResponse>
      >(APP_CONSTANTS.API_ENDPOINTS.MY_TASKS, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  public getSuggestedTasks(params: SuggestedTasksParams): Observable<ApiResponse<Task[]>> {
    const httpParams = new HttpParams()
      .set('skillName', params.skillName)
      .set('taskType', params.taskType)
      .set('limit', (params.limit ?? 5).toString());

    return this.apiService
      .get<ApiResponse<Task[]>>(APP_CONSTANTS.API_ENDPOINTS.TASKS, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  public getTaskById(id: string): Observable<ApiResponse<Task>> {
    return this.apiService
      .get<ApiResponse<Task>>(`${APP_CONSTANTS.API_ENDPOINTS.TASKS}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: unknown): Observable<never> => {
    this.errorHandler.logError(error);
    return throwError(() => this.errorHandler.getError(error));
  };
}
