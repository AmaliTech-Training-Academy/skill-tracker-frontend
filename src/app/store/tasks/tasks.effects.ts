import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { TaskMockService } from '@app/features/tasks-dashboard/services/task-mock.service';
import { TaskIcon, TaskStatus, Task } from '../../core/models/tasks-model';
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
          map(({ success, data, message }) => {
            if (success) {
              const { pending, completed } = data;
              const todayTasks = pending.content.map((task: Task) => ({
                ...task,
                icon: task.type === 'CODING' ? TaskIcon.ABC : TaskIcon.PENCIL,
                status: TaskStatus.PENDING,
                createdAt: new Date().toISOString(),
              }));
              const previousTasks = completed.content.map((task: Task) => ({
                ...task,
                icon: task.type === 'CODING' ? TaskIcon.ABC : TaskIcon.PENCIL,
                status: TaskStatus.COMPLETED,
                createdAt: new Date().toISOString(),
              }));
              return TasksActions.loadTasksSuccess({ todayTasks, previousTasks });
            } else {
              return TasksActions.loadTasksFailure({ error: message });
            }
          }),
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
