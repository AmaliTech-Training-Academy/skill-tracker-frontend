import { createReducer, on } from '@ngrx/store';
import { initialWebSocketState } from './websocket.state';
import {
  connectWebSocketSuccess,
  disconnectWebSocketSuccess,
  executionResultReceived,
  feedbackReceived,
  taskGenerationUpdateReceived,
  webSocketError,
} from './websocket.actions';

export const websocketReducer = createReducer(
  initialWebSocketState,

  on(connectWebSocketSuccess, (state) => ({
    ...state,
    isConnected: true,
    error: null,
  })),
  on(disconnectWebSocketSuccess, (state) => ({
    ...state,
    isConnected: false,
  })),
  on(webSocketError, (state, { error }) => ({
    ...state,
    error,
    isConnected: false,
  })),
  on(executionResultReceived, (state, { payload }) => ({
    ...state,
    latestExecutionResult: payload,
  })),
  on(feedbackReceived, (state, { payload }) => ({
    ...state,
    latestFeedback: payload,
  })),
  on(taskGenerationUpdateReceived, (state, { payload }) => ({
    ...state,
    latestTaskGenerationUpdate: payload,
  })),
);
