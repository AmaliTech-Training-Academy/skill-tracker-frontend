import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, interval } from 'rxjs';
import { map, takeWhile, takeUntil } from 'rxjs/operators';
import * as TasksActions from '../../../store/tasks/tasks.actions';
import {
  GroupedTasksResponse,
  Task,
  TaskPaginationParams,
  SuggestedTasksParams,
} from '../../../core/models/tasks-model';
import { ApiResponse } from '@app/core';
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
    let httpParams = new HttpParams()
      .set('pendingPage', (params.pendingPage ?? 0).toString())
      .set('pendingSize', (params.pendingSize ?? 10).toString())
      .set('completedPage', (params.completedPage ?? 0).toString())
      .set('completedSize', (params.completedSize ?? 10).toString());

    if (params.skillName) {
      httpParams = httpParams.set('skillName', params.skillName);
    }

    if (params.completedPeriod) {
      httpParams = httpParams.set('completedPeriod', params.completedPeriod);
    }

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

  public createTimerStream(
    durationMinutes: number,
  ): Observable<{ remainingSeconds: number; expired: boolean }> {
    const SECONDS_PER_MINUTE = 60;
    const TIMER_INTERVAL_MS = 1000;
    const TIMER_TICK_DECREMENT = 1;
    const MINIMUM_SECONDS = 0;

    const totalSeconds = durationMinutes * SECONDS_PER_MINUTE;
    return interval(TIMER_INTERVAL_MS).pipe(
      map((tick) => totalSeconds - tick - TIMER_TICK_DECREMENT),
      takeWhile((remainingSeconds) => remainingSeconds >= MINIMUM_SECONDS, true),
      map((remainingSeconds) => ({
        remainingSeconds: Math.max(MINIMUM_SECONDS, remainingSeconds),
        expired: remainingSeconds <= MINIMUM_SECONDS,
      })),
    );
  }

  public startTimerWithCancellation(durationMinutes: number, cancel$: Observable<unknown>) {
    return this.createTimerStream(durationMinutes).pipe(
      takeUntil(cancel$),
      map(({ remainingSeconds, expired }) =>
        expired ? TasksActions.timerExpired() : TasksActions.updateTimer({ remainingSeconds }),
      ),
    );
  }

  private handleError = (error: unknown): Observable<never> => {
    this.errorHandler.logError(error);
    return throwError(() => this.errorHandler.getError(error));
  };
}
