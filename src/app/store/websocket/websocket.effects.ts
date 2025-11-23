import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { WebSocketService } from '@app/core/services/websocket/websocket.service';
import { connectWebSocket, disconnectWebSocket } from './websocket.actions';

import {
  loginSuccess,
  checkAuthSessionSuccess,
  logoutSuccess,
  loginFailure,
} from '../auth/auth.actions';

@Injectable()
export class WebSocketEffects {
  private actions$ = inject(Actions);
  private webSocketService = inject(WebSocketService);

  public connectOnSessionValid$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess, checkAuthSessionSuccess),
        tap(() => {
          this.webSocketService.connect();
        }),
      ),
    { dispatch: false },
  );

  public disconnectOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess, loginFailure),
        tap(() => {
          this.webSocketService.disconnect();
        }),
      ),
    { dispatch: false },
  );

  public connect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(connectWebSocket),
        tap(() => this.webSocketService.connect()),
      ),
    { dispatch: false },
  );

  public disconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(disconnectWebSocket),
        tap(() => this.webSocketService.disconnect()),
      ),
    { dispatch: false },
  );
}
