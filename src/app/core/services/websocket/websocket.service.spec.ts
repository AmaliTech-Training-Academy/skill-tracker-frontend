import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { Store } from '@ngrx/store';
import { Client } from '@stomp/stompjs';
import * as WebSocketActions from '@app/store/websocket/websocket.actions';

const mockStore = {
  dispatch: jest.fn(),
};

const mockActivate = jest.fn();
const mockDeactivate = jest.fn();
const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@stomp/stompjs', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      connected: true,
      activate: mockActivate,
      deactivate: mockDeactivate,
      subscribe: mockSubscribe,
    })),
  };
});

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService, { provide: Store, useValue: mockStore }],
    });

    service = TestBed.inject(WebSocketService);

    jest.clearAllMocks();

    mockSubscribe.mockReturnValue({ unsubscribe: mockUnsubscribe });
  });

  test('should create STOMP client and activate connection on connect()', () => {
    service.connect();

    expect(Client).toHaveBeenCalled();
    expect(mockActivate).toHaveBeenCalled();
  });

  test('should dispatch connectWebSocketSuccess on onConnect()', () => {
    service.connect();

    const opts = (Client as jest.Mock).mock.calls[0][0];
    opts.onConnect();

    expect(mockStore.dispatch).toHaveBeenCalledWith(WebSocketActions.connectWebSocketSuccess());
  });

  test('should subscribe to /user/queue/execution on connect()', () => {
    service.connect();

    const opts = (Client as jest.Mock).mock.calls[0][0];
    opts.onConnect();

    expect(mockSubscribe).toHaveBeenCalledWith('/user/queue/execution', expect.any(Function));
  });

  test('should unsubscribe and dispatch disconnect on disconnect()', () => {
    service.connect();
    const opts = (Client as jest.Mock).mock.calls[0][0];
    opts.onConnect();

    service.disconnect();

    expect(mockUnsubscribe).toHaveBeenCalled();
    expect(mockDeactivate).toHaveBeenCalled();

    expect(mockStore.dispatch).toHaveBeenCalledWith(WebSocketActions.disconnectWebSocketSuccess());
  });

  test('should dispatch execution result message', () => {
    service.connect();
    const opts = (Client as jest.Mock).mock.calls[0][0];
    opts.onConnect();

    const callback = mockSubscribe.mock.calls[0][1];

    const fakePayload = {
      submissionId: '123',
      stdout: 'output',
      stderr: '',
      testResults: [],
      allTestsPassed: true,
      testsPassed: 1,
      testsTotal: 1,
      avgExecutionTimeMs: 10,
      avgMemoryUsedKb: 20,
    };

    callback({ body: JSON.stringify(fakePayload) });

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      WebSocketActions.executionResultReceived({ payload: fakePayload }),
    );
  });
});
