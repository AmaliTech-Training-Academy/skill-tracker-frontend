import {
  ExecutionResultMessage,
  FeedbackMessage,
  TaskGenerationMessage,
} from '@app/core/services/websocket/websocket.service';

export interface WebSocketState {
  isConnected: boolean;
  error: string | null;

  latestExecutionResult: ExecutionResultMessage | null;
  latestFeedback: FeedbackMessage | null;
  latestTaskGenerationUpdate: TaskGenerationMessage | null;
}

export const initialWebSocketState: WebSocketState = {
  isConnected: false,
  error: null,
  latestExecutionResult: null,
  latestFeedback: null,
  latestTaskGenerationUpdate: null,
};
