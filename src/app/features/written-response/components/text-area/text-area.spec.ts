import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import { TextArea } from './text-area';

interface MockSpeechRecognitionEvent {
  resultIndex: number;
  results: MockSpeechRecognitionResultList;
}

interface MockSpeechRecognitionResultList {
  length: number;
  [index: number]: MockSpeechRecognitionResult;
}

interface MockSpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: MockSpeechRecognitionAlternative;
}

interface MockSpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface MockSpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

class MockSpeechRecognition implements EventTarget {
  continuous = false;
  interimResults = false;
  lang = '';
  onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
  onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
  onend: (() => void) | null = null;

  private eventListeners: Map<string, EventListenerOrEventListenerObject[]> = new Map();

  start(): void {}

  stop(): void {}

  abort(): void {}

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    if (!callback) return;
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    this.eventListeners.get(type)?.push(callback);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    if (!callback) return;
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        if (typeof listener === 'function') {
          listener(event);
        } else {
          listener.handleEvent(event);
        }
      });
      return true;
    }
    return false;
  }
}

describe('TextArea Component', () => {
  let component: TextArea;
  let fixture: ComponentFixture<TextArea>;
  let mockSpeechRecognition: MockSpeechRecognition;

  beforeEach(async () => {
    mockSpeechRecognition = new MockSpeechRecognition();
    const MockSpeechRecognitionConstructor = jest.fn(() => mockSpeechRecognition);

    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      configurable: true,
      value: MockSpeechRecognitionConstructor,
    });

    await TestBed.configureTestingModule({
      imports: [TextArea, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextArea);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      configurable: true,
      value: undefined,
    });

    Object.defineProperty(window, 'webkitSpeechRecognition', {
      writable: true,
      configurable: true,
      value: undefined,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize text with textValue on ngOnInit', () => {
    component.textValue = 'Initial text';
    component.ngOnInit();
    expect(component.text).toBe('Initial text');
  });

  it('should update text when textValue changes in ngOnChanges', () => {
    const changes = {
      textValue: new SimpleChange(null, 'New text', false),
    };
    component.ngOnChanges(changes);
    expect(component.text).toBe('New text');
  });

  it('should not update text when textValue is undefined in ngOnChanges', () => {
    component.text = 'Existing text';
    const changes = {
      textValue: new SimpleChange(null, undefined, false),
    };
    component.ngOnChanges(changes);
    expect(component.text).toBe('Existing text');
  });

  it('should emit textChange event when onTextChange is called', () => {
    const emitSpy = jest.spyOn(component.textChange, 'emit');
    component.text = 'Test text';
    component.onTextChange();
    expect(emitSpy).toHaveBeenCalledWith('Test text');
  });

  it('should toggle isRecording state when toggleRecording is called', () => {
    const startSpy = jest.spyOn(mockSpeechRecognition, 'start');
    const stopSpy = jest.spyOn(mockSpeechRecognition, 'stop');

    component.toggleRecording();
    expect(component.isRecording).toBe(true);
    expect(startSpy).toHaveBeenCalled();

    component.toggleRecording();
    expect(component.isRecording).toBe(false);
    expect(stopSpy).toHaveBeenCalled();
  });

  it('should show alert when speech recognition is not supported', () => {
    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      configurable: true,
      value: undefined,
    });

    const newFixture = TestBed.createComponent(TextArea);
    const newComponent = newFixture.componentInstance;

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    newComponent.toggleRecording();

    expect(alertSpy).toHaveBeenCalledWith(
      'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
    );
    expect(newComponent.isRecording).toBe(false);

    alertSpy.mockRestore();
  });

  it('should handle speech recognition results', () => {
    const emitSpy = jest.spyOn(component.textChange, 'emit');
    component.text = 'Initial ';

    const mockEvent: MockSpeechRecognitionEvent = {
      resultIndex: 0,
      results: {
        length: 1,
        0: {
          isFinal: true,
          length: 1,
          0: { transcript: 'transcribed text', confidence: 0.9 },
        },
      },
    };

    if (mockSpeechRecognition.onresult) {
      mockSpeechRecognition.onresult(mockEvent);
    }

    expect(component.text).toBe('Initial transcribed text ');
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle speech recognition errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.isRecording = true;

    const mockErrorEvent: MockSpeechRecognitionErrorEvent = {
      error: 'no-speech',
      message: 'No speech detected',
    };

    if (mockSpeechRecognition.onerror) {
      mockSpeechRecognition.onerror(mockErrorEvent);
    }

    expect(component.isRecording).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Speech recognition error:', 'no-speech');

    consoleErrorSpy.mockRestore();
  });

  it('should restart recognition when it ends while still recording', () => {
    const startSpy = jest.spyOn(mockSpeechRecognition, 'start');

    component.isRecording = true;

    if (mockSpeechRecognition.onend) {
      mockSpeechRecognition.onend();
    }

    expect(startSpy).toHaveBeenCalled();
  });

  it('should not restart recognition when it ends and not recording', () => {
    const startSpy = jest.spyOn(mockSpeechRecognition, 'start');

    component.isRecording = false;

    if (mockSpeechRecognition.onend) {
      mockSpeechRecognition.onend();
    }

    expect(startSpy).not.toHaveBeenCalled();
  });

  it('should stop recognition on component destroy if recording', () => {
    const stopSpy = jest.spyOn(mockSpeechRecognition, 'stop');

    component.isRecording = true;
    component.ngOnDestroy();

    expect(stopSpy).toHaveBeenCalled();
  });

  it('should not stop recognition on component destroy if not recording', () => {
    const stopSpy = jest.spyOn(mockSpeechRecognition, 'stop');

    component.isRecording = false;
    component.ngOnDestroy();

    expect(stopSpy).not.toHaveBeenCalled();
  });

  it('should handle error when starting speech recognition', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const startSpy = jest.spyOn(mockSpeechRecognition, 'start').mockImplementation(() => {
      throw new Error('Recognition start failed');
    });

    component.toggleRecording();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error starting speech recognition:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
    startSpy.mockRestore();
  });

  it('should set recognition properties correctly on initialization', () => {
    expect(mockSpeechRecognition.continuous).toBe(true);
    expect(mockSpeechRecognition.interimResults).toBe(true);
    expect(mockSpeechRecognition.lang).toBe('en-US');
  });

  it('should focus and set cursor position after applying format', (done) => {
    component.text = 'Hello World';
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const focusSpy = jest.spyOn(textarea, 'focus');
    const setSelectionSpy = jest.spyOn(textarea, 'setSelectionRange');

    textarea.selectionStart = 0;
    textarea.selectionEnd = 5;

    component.applyFormat('bold');

    setTimeout(() => {
      expect(focusSpy).toHaveBeenCalled();
      expect(setSelectionSpy).toHaveBeenCalled();
      done();
    }, 10);
  });
});
