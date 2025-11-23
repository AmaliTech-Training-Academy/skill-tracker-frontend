import { Injectable, OnDestroy, inject } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Store } from '@ngrx/store';
import * as WebSocketActions from '@app/store/websocket/websocket.actions';
import { AppState } from '@app/store/app.state';
import { environment } from '../../../../environments/environment';

export interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
  memoryUsedKb: number;
  statusDescription: string;
}

export interface ExecutionResultMessage {
  submissionId: string;
  stdout: string;
  stderr: string;
  testResults: TestResult[];
  allTestsPassed: boolean;
  testsPassed: number;
  testsTotal: number;
  avgExecutionTimeMs: number;
  avgMemoryUsedKb: number;
}

export interface FeedbackMessage {
  submissionId: string;
  status: 'COMPLETED';
  score: number;
  isCorrect: boolean;
  feedbackType: 'CODING';
  overallFeedback: string;
  stdout: string;
  stderr: string;
  testResults: TestResult[];
  avgExecutionTimeMs: number;
  avgMemoryUsedKb: number;
}

export interface TaskGenerationMessage {
  userId: string;
  status: 'COMPLETED' | 'FAILED';
  message: string;
  completedAt: string;
  tasksGenerated?: number;
}

export const WS_RECONNECT_DELAY = 5000;
export const WS_HEARTBEAT_INCOMING = 10000;
export const WS_HEARTBEAT_OUTGOING = 10000;

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();

  private store = inject(Store<AppState>);

  private readonly wsUrl = environment.websocket as string;

  public connect(): void {
    if (this.client?.connected) return;

    this.client = new Client({
      brokerURL: this.wsUrl,
      reconnectDelay: WS_RECONNECT_DELAY,
      heartbeatIncoming: WS_HEARTBEAT_INCOMING,
      heartbeatOutgoing: WS_HEARTBEAT_OUTGOING,

      onConnect: () => {
        this.store.dispatch(WebSocketActions.connectWebSocketSuccess());
        this.subscribeToTopics();
      },

      onDisconnect: () => {
        this.store.dispatch(WebSocketActions.disconnectWebSocketSuccess());
      },

      onStompError: (frame) => {
        this.store.dispatch(WebSocketActions.webSocketError({ error: frame.headers['message'] }));
      },

      onWebSocketError: (event) => {
        this.store.dispatch(WebSocketActions.webSocketError({ error: 'Connection failed' }));
      },
    });

    this.client.activate();
  }

  private subscribeToTopics(): void {
    if (!this.client?.connected) return;

    const execSub = this.client.subscribe('/user/queue/execution', (msg: IMessage) => {
      const result: ExecutionResultMessage = JSON.parse(msg.body);

      this.store.dispatch(WebSocketActions.executionResultReceived({ payload: result }));
    });
    this.subscriptions.set('execution', execSub);
  }

  public disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.store.dispatch(WebSocketActions.disconnectWebSocketSuccess());
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
