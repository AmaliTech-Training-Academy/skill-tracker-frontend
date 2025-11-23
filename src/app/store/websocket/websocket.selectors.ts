import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WebSocketState } from './websocket.state';

export const selectWebSocketState = createFeatureSelector<WebSocketState>('websocket');

export const selectIsWebSocketConnected = createSelector(
  selectWebSocketState,
  ({ isConnected }) => isConnected,
);

export const selectLatestExecutionResult = createSelector(
  selectWebSocketState,
  ({ latestExecutionResult }) => latestExecutionResult,
);

export const selectLatestFeedback = createSelector(
  selectWebSocketState,
  ({ latestFeedback }) => latestFeedback,
);

export const selectLatestTaskGenerationUpdate = createSelector(
  selectWebSocketState,
  ({ latestTaskGenerationUpdate }) => latestTaskGenerationUpdate,
);
