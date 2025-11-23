import { createAction, props } from '@ngrx/store';
import {
  ExecutionResultMessage,
  FeedbackMessage,
  TaskGenerationMessage,
} from '@app/core/services/websocket/websocket.service';

export const connectWebSocket = createAction('[WebSocket] Connect');

export const connectWebSocketSuccess = createAction('[WebSocket] Connect Success');

export const disconnectWebSocket = createAction('[WebSocket] Disconnect');

export const disconnectWebSocketSuccess = createAction('[WebSocket] Disconnect Success');

export const webSocketError = createAction('[WebSocket] Error', props<{ error: string }>());

export const executionResultReceived = createAction(
  '[WebSocket] Execution Result Received',
  props<{ payload: ExecutionResultMessage }>(),
);

export const feedbackReceived = createAction(
  '[WebSocket] Feedback Received',
  props<{ payload: FeedbackMessage }>(),
);

export const taskGenerationUpdateReceived = createAction(
  '[WebSocket] Task Generation Update Received',
  props<{ payload: TaskGenerationMessage }>(),
);
