import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, timer, from } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom, takeWhile } from 'rxjs/operators';
import { TaskService } from '@app/features/tasks-dashboard/services/task.service';
import { ToastService } from '@app/core/services/toast/toast-service';
import * as TasksActions from './tasks.actions';
import {
  selectCurrentTaskLanguageId,
  selectCurrentTask,
  selectTimeRangeFilter,
} from './tasks.selectors';
import { APP_CONSTANTS } from '@app/core';
import { TaskType } from '@app/core/models/tasks-model';

const POLLING_INTERVAL_MS = 2000;

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private taskService: TaskService,
    private router: Router,
    private toastService: ToastService,
    private store: Store,
  ) {}

  public loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      withLatestFrom(this.store.select(selectTimeRangeFilter)),
      switchMap(([, timeRangeFilter]) => {
        return this.taskService.getAllTasks({ completedPeriod: timeRangeFilter }).pipe(
          map((response) => TasksActions.loadTasksSuccess({ data: response.data })),
          catchError(() => of(TasksActions.loadTasksFailure({ error: 'Failed to load tasks' }))),
        );
      }),
    ),
  );

  public reloadTasksOnTimeFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.changeTimeRangeFilter),
      map(() => TasksActions.loadTasks()),
    ),
  );

  public startTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TasksActions.startTask),
        tap(({ taskId, taskType }) => {
          const routeMap = {
            [TaskType.CODING]: APP_CONSTANTS.APP_ROUTES.CODING_ASSESSMENT,
            [TaskType.ESSAY]: APP_CONSTANTS.APP_ROUTES.WRITTEN_ASSESSMENT,
            [TaskType.MULTIPLE_CHOICE]: APP_CONSTANTS.APP_ROUTES.MULTIPLE_CHOICE,
          };
          this.router.navigate([routeMap[taskType], taskId]);
        }),
      ),
    { dispatch: false },
  );

  public loadCurrentTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadCurrentTask),
      switchMap(({ taskId }) =>
        this.taskService.getTaskById(taskId).pipe(
          map((response) => TasksActions.loadCurrentTaskSuccess({ task: response.data })),
          catchError((error) => {
            this.toastService.showError(
              'Task Load Error',
              'Failed to load task. Please try again.',
            );
            return of(TasksActions.loadCurrentTaskFailure({ error: 'Failed to load task' }));
          }),
        ),
      ),
    ),
  );

  public startTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.startTimer),
      switchMap(({ durationMinutes }) =>
        this.taskService.startTimerWithCancellation(
          durationMinutes,
          this.actions$.pipe(ofType(TasksActions.stopTimer, TasksActions.clearCurrentTask)),
        ),
      ),
    ),
  );

  public restoreTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.restoreTimer),
      switchMap(({ taskId }) =>
        this.taskService.restoreTimerFromStorage(
          this.actions$.pipe(ofType(TasksActions.stopTimer, TasksActions.clearCurrentTask)),
          taskId,
        ),
      ),
    ),
  );

  public timerExpired$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TasksActions.timerExpired),
        tap(() => {
          this.toastService.showWarning('Time Up!', 'Your time for this task has expired.');
          this.taskService.clearTimerStorage();
        }),
      ),
    { dispatch: false },
  );

  public saveTimerState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TasksActions.startTimer),
        tap(({ durationMinutes, taskId }) => {
          this.taskService.saveTimerState(durationMinutes, taskId);
        }),
      ),
    { dispatch: false },
  );

  public clearTimerStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TasksActions.stopTimer, TasksActions.clearCurrentTask),
        tap(() => this.taskService.clearTimerStorage()),
      ),
    { dispatch: false },
  );

  public loadUserSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadUserSkills),
      switchMap(() =>
        this.taskService.getUserSkills().pipe(
          map(({ data }) =>
            TasksActions.loadUserSkillsSuccess({ skills: this.taskService.formatSkillNames(data) }),
          ),
          catchError(() =>
            of(TasksActions.loadUserSkillsFailure({ error: 'Failed to load user skills' })),
          ),
        ),
      ),
    ),
  );

  public executeCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.executeCode),
      withLatestFrom(this.store.select(selectCurrentTaskLanguageId)),
      switchMap(([{ taskId, code }, languageId]) =>
        this.taskService.executeCode({ taskId, code, languageId }).pipe(
          map((response) => TasksActions.executeCodeSuccess({ result: response.data })),
          catchError((error) => {
            this.toastService.showError('Execution Error', 'Failed to execute code');
            return of(TasksActions.executeCodeFailure({ error: 'Failed to execute code' }));
          }),
        ),
      ),
    ),
  );

  public submitTaskSolution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.submitTaskSolution),
      withLatestFrom(
        this.store.select(selectCurrentTaskLanguageId),
        this.store.select(selectCurrentTask),
      ),
      switchMap(([action, languageId, currentTask]) =>
        this.handleTaskSubmission(action, languageId, currentTask),
      ),
    ),
  );

  public getSubmissionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.getSubmissionStatus),
      switchMap(({ submissionId }) => this.handleSubmissionStatus(submissionId, 'Status Error')),
    ),
  );

  public retryFeedback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.retryFeedback),
      switchMap(({ submissionId }) => this.handleSubmissionStatus(submissionId, 'Retry Failed')),
    ),
  );

  private handleTaskSubmission(
    action: { taskId: string; code: string },
    languageId: number,
    currentTask: { xpReward?: number } | null,
  ) {
    return this.taskService
      .submitTask({
        taskId: action.taskId,
        answer: {
          answerType: 'CODING',
          code: action.code,
          languageId,
        },
      })
      .pipe(
        map((response) =>
          TasksActions.submitTaskSolutionSuccess({
            submissionId: response.data.submissionId,
            xpEarned: currentTask?.xpReward || 0,
          }),
        ),
        catchError((error) => {
          this.toastService.showError('Submission Error', 'Failed to submit solution');
          return of(TasksActions.submitTaskSolutionFailure({ error: 'Failed to submit solution' }));
        }),
      );
  }

  private handleSubmissionStatus(submissionId: string, errorTitle: string) {
    return this.taskService.getSubmissionStatus(submissionId).pipe(
      switchMap((response) => {
        if (this.taskService.shouldReloadTasks(response.data)) {
          return from([
            TasksActions.getSubmissionStatusSuccess({ submission: response.data }),
            TasksActions.loadTasks(),
          ]);
        }
        return of(TasksActions.getSubmissionStatusSuccess({ submission: response.data }));
      }),
      catchError((error) => {
        this.toastService.showError(errorTitle, 'Failed to get submission status');
        return of(
          TasksActions.getSubmissionStatusFailure({ error: 'Failed to get submission status' }),
        );
      }),
    );
  }

  public retrySubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.retrySubmission),
      map((action) =>
        TasksActions.submitTaskSolution({
          taskId: action.taskId,
          code: action.code,
          languageId: action.languageId,
        }),
      ),
    ),
  );

  public autoRequestFeedback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.submitTaskSolutionSuccess),
      map(({ submissionId }) => TasksActions.getSubmissionStatus({ submissionId })),
    ),
  );

  public pollSubmissionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.getSubmissionStatusSuccess),
      switchMap(({ submission }) => {
        if (this.taskService.shouldPollStatus(submission)) {
          return timer(POLLING_INTERVAL_MS).pipe(
            map(() => TasksActions.getSubmissionStatus({ submissionId: submission.id })),
            takeWhile(() => true, true),
          );
        }
        return of();
      }),
    ),
  );
}
