import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  loadDashboardAnalytics,
  loadDashboardAnalyticsSuccess,
  loadDashboardAnalyticsFailure,
  loadRecommendedTasks,
  loadRecommendedTasksSuccess,
  loadRecommendedTasksFailure,
  loadDashboardTrajectory,
  loadDashboardTrajectorySuccess,
  loadDashboardTrajectoryFailure,
} from './dashboard.actions';
import { DashboardService, ErrorHandlerService } from '@app/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  public loadDashboardAnalytics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboardAnalytics),
      switchMap(() =>
        this.dashboardService.getDashboardAnalytics().pipe(
          map(({ data }) => loadDashboardAnalyticsSuccess({ data })),
          catchError((error: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(error);
            return of(loadDashboardAnalyticsFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public loadRecommendedTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecommendedTasks),
      switchMap(() =>
        this.dashboardService.getDashboardRecommendedTasks().pipe(
          map(({ data }) => loadRecommendedTasksSuccess({ tasks: data })),
          catchError((error: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(error);
            return of(loadRecommendedTasksFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );

  public loadDashboardTrajectory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboardTrajectory),
      switchMap(({ skillId, granularity }) =>
        this.dashboardService.getDashboardTrajectory(skillId, granularity).pipe(
          map(({ data }) => loadDashboardTrajectorySuccess({ trajectoryData: data })),
          catchError((error: HttpErrorResponse) => {
            const appError = this.errorHandlerService.getError(error);
            return of(loadDashboardTrajectoryFailure({ error: appError }));
          }),
        ),
      ),
    ),
  );
}
