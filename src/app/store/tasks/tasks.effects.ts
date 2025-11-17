import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, takeUntil } from 'rxjs/operators';
import { TaskMockService } from '@app/features/tasks-dashboard/services/task-mock.service';
import { TaskService } from '@app/features/tasks-dashboard/services/task.service';
import { ToastService } from '@app/core/services/toast/toast-service';
import * as TasksActions from './tasks.actions';
import { APP_CONSTANTS } from '@app/core';

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private taskMockService: TaskMockService,
    private taskService: TaskService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  public loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(() =>
        this.taskMockService.getAllTasks().pipe(
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
        this.taskMockService.getTaskById(taskId).pipe(
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
        this.taskService.createTimerStream(durationMinutes).pipe(
          takeUntil(
            this.actions$.pipe(ofType(TasksActions.stopTimer, TasksActions.clearCurrentTask)),
          ),
          map(({ remainingSeconds, expired }) => {
            if (expired) {
              this.toastService.showWarning('Time Up!', 'Your time for this task has expired.');
              return TasksActions.timerExpired();
            }
            return TasksActions.updateTimer({ remainingSeconds });
          }),
        ),
      ),
    ),
  );
}
