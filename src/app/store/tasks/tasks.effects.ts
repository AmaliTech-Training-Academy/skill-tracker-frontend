import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { TaskService } from '@app/features/tasks-dashboard/services/task.service';
import { ToastService } from '@app/core/services/toast/toast-service';
import * as TasksActions from './tasks.actions';
import { selectCurrentTaskLanguageId } from './tasks.selectors';
import { APP_CONSTANTS } from '@app/core';

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
      switchMap(() =>
        this.taskService.getAllTasks().pipe(
          map((response) => TasksActions.loadTasksSuccess({ data: response.data })),
          catchError((error) =>
            of(TasksActions.loadTasksFailure({ error: 'Failed to load tasks' })),
          ),
        ),
      ),
    ),
  );

  public startTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TasksActions.startTask),
        tap(({ taskId }) => {
          this.router.navigate([APP_CONSTANTS.APP_ROUTES.CODING_ASSESSMENT, taskId]);
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
      withLatestFrom(this.store.select(selectCurrentTaskLanguageId)),
      switchMap(([{ taskId, code }, languageId]) =>
        this.taskService
          .submitTask({
            taskId,
            answer: { answerType: 'CODE', code, languageId },
          })
          .pipe(
            map((response) => {
              this.toastService.showSuccess('Success', 'Solution submitted successfully');
              return TasksActions.submitTaskSolutionSuccess({
                submissionId: response.data.submissionId,
              });
            }),
            catchError((error) => {
              this.toastService.showError('Submission Error', 'Failed to submit solution');
              return of(
                TasksActions.submitTaskSolutionFailure({ error: 'Failed to submit solution' }),
              );
            }),
          ),
      ),
    ),
  );
}
