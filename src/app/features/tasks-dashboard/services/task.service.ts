import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  ApiResponse,
  GroupedTasksResponse,
  Task,
  TaskPaginationParams,
  SuggestedTasksParams,
} from '../../../core/models/tasks-model';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../../../core/services/error/error-handler';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = `${environment.url}/api/v1/tasks`;

  constructor(
    private http: HttpClient,
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

    return this.http
      .get<ApiResponse<GroupedTasksResponse>>(`${this.apiUrl}/my-tasks`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  public getSuggestedTasks(params: SuggestedTasksParams): Observable<ApiResponse<Task[]>> {
    const httpParams = new HttpParams()
      .set('skillName', params.skillName)
      .set('taskType', params.taskType)
      .set('limit', (params.limit ?? 5).toString());

    return this.http
      .get<ApiResponse<Task[]>>(this.apiUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  public getTaskById(id: string): Observable<ApiResponse<Task>> {
    return this.http
      .get<ApiResponse<Task>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: unknown): Observable<never> => {
    this.errorHandler.logError(error);
    return throwError(() => this.errorHandler.getError(error));
  };
}
