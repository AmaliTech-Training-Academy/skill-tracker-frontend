import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, interval, of, merge } from 'rxjs';
import { map, takeWhile, takeUntil, scan } from 'rxjs/operators';
import * as TasksActions from '../../../store/tasks/tasks.actions';
import {
  GroupedTasksResponse,
  Task,
  TaskPaginationParams,
  SuggestedTasksParams,
  CodeExecutionRequest,
  CodeExecutionResponse,
  TaskSubmission,
  SubmissionResponse,
  TaskUserSkill,
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

    if (params.completedPeriod && params.completedPeriod !== 'ALL_PERIODS') {
      httpParams = httpParams.set('completedPeriod', params.completedPeriod);
    }

    return this.apiService
      .get<
        ApiResponse<GroupedTasksResponse>
      >(APP_CONSTANTS.API_ENDPOINTS.MY_TASKS, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  public formatSkillNames(skills: TaskUserSkill[]): string[] {
    return ['All Skills', ...skills.map(({ skillName }) => skillName)];
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
      scan((remainingSeconds) => remainingSeconds - TIMER_TICK_DECREMENT, totalSeconds),
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

  public createTimerFromSeconds(remainingSeconds: number, cancel$: Observable<unknown>) {
    const TIMER_INTERVAL_MS = 1000;
    const TIMER_TICK_DECREMENT = 1;
    const MINIMUM_SECONDS = 0;

    return interval(TIMER_INTERVAL_MS).pipe(
      scan((remaining) => remaining - TIMER_TICK_DECREMENT, remainingSeconds),
      takeWhile((remaining) => remaining >= MINIMUM_SECONDS, true),
      takeUntil(cancel$),
      map((remaining) => ({
        remainingSeconds: Math.max(MINIMUM_SECONDS, remaining),
        expired: remaining <= MINIMUM_SECONDS,
      })),
      map(({ remainingSeconds, expired }) =>
        expired ? TasksActions.timerExpired() : TasksActions.updateTimer({ remainingSeconds }),
      ),
    );
  }

  public restoreTimerFromStorage(cancel$: Observable<unknown>, currentTaskId?: string) {
    const MILLISECONDS_TO_SECONDS = 1000;
    const saved = localStorage.getItem('taskTimer');
    if (!saved) return of();

    const timerData = JSON.parse(saved);
    const remainingMs = timerData.endTime - Date.now();

    if (remainingMs <= 0) {
      this.clearTimerStorage();
      if (currentTaskId && timerData.taskId === currentTaskId) {
        return of(TasksActions.timerExpired());
      }
      return of();
    }

    const remainingSeconds = Math.ceil(remainingMs / MILLISECONDS_TO_SECONDS);
    const restoredTimer = {
      isRunning: true,
      remainingSeconds,
      endTime: timerData.endTime,
      taskId: timerData.taskId,
    };

    return merge(
      of(TasksActions.restoreTimerSuccess({ timer: restoredTimer })),
      this.createTimerFromSeconds(remainingSeconds, cancel$),
    );
  }

  public saveTimerState(durationMinutes: number, taskId: string): void {
    const SECONDS_PER_MINUTE = 60;
    const MILLISECONDS_TO_SECONDS = 1000;

    const totalSeconds = durationMinutes * SECONDS_PER_MINUTE;
    const endTime = Date.now() + totalSeconds * MILLISECONDS_TO_SECONDS;
    const timerState = { isRunning: true, remainingSeconds: totalSeconds, endTime, taskId };
    localStorage.setItem('taskTimer', JSON.stringify(timerState));
  }

  public clearTimerStorage(): void {
    localStorage.removeItem('taskTimer');
  }

  public executeCode(
    request: CodeExecutionRequest,
  ): Observable<ApiResponse<CodeExecutionResponse>> {
    return this.apiService
      .post<ApiResponse<CodeExecutionResponse>>(APP_CONSTANTS.API_ENDPOINTS.RUN_CODE, request)
      .pipe(catchError(this.handleError));
  }

  public submitTask(submission: TaskSubmission): Observable<ApiResponse<SubmissionResponse>> {
    return this.apiService
      .post<ApiResponse<SubmissionResponse>>(APP_CONSTANTS.API_ENDPOINTS.SUBMISSIONS, submission)
      .pipe(catchError(this.handleError));
  }

  public getSubmissionStatus(submissionId: string): Observable<ApiResponse<SubmissionResponse>> {
    return this.apiService
      .get<
        ApiResponse<SubmissionResponse>
      >(`${APP_CONSTANTS.API_ENDPOINTS.SUBMISSIONS}/${submissionId}`)
      .pipe(catchError(this.handleError));
  }

  public shouldReloadTasks(submission: SubmissionResponse): boolean {
    return submission.status === 'COMPLETED' && submission.isCorrect === true;
  }

  public shouldPollStatus(submission: SubmissionResponse): boolean {
    return submission.status === 'PENDING' || submission.status === 'IN_PROGRESS';
  }

  public getUserSkills(): Observable<ApiResponse<TaskUserSkill[]>> {
    return this.apiService
      .get<ApiResponse<TaskUserSkill[]>>(APP_CONSTANTS.API_ENDPOINTS.USER_SKILLS)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: unknown): Observable<never> => {
    this.errorHandler.logError(error);
    return throwError(() => this.errorHandler.getError(error));
  };
}
