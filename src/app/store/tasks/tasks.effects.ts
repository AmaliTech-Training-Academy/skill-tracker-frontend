import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { TaskMockService } from '@app/features/tasks-dashboard/services/task-mock.service';
import * as TasksActions from './tasks.actions';
import { APP_CONSTANTS } from '@app/core';

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private taskMockService: TaskMockService,
    private router: Router,
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
}
