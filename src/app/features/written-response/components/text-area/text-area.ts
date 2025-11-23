import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@app/core';
import {
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
  SpeechRecognition,
} from './text-area.model';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-area.html',
  styleUrl: './text-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextArea implements OnInit, OnChanges, OnDestroy {
  @ViewChild('textarea') public textarea!: ElementRef<HTMLTextAreaElement>;
  @Input() public textValue: string = '';

  public text: string = '';
  public isRecording: boolean = false;
  @Output() public textChange = new EventEmitter<string>();

  private recognition: SpeechRecognition | null = null;
  private isRecognitionSupported: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.text = this.textValue;
    this.initializeSpeechRecognition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textValue'] && changes['textValue'].currentValue !== undefined) {
      this.text = changes['textValue'].currentValue;
    }
  }

  ngOnDestroy(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  }

  private initializeSpeechRecognition(): void {
    const speechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!speechRecognitionClass) {
      return;
    }

    this.isRecognitionSupported = true;
    this.recognition = new speechRecognitionClass();
    this.configureSpeechRecognition();
    this.setupSpeechRecognitionHandlers();
  }

  private configureSpeechRecognition(): void {
    if (!this.recognition) {
      return;
    }

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  private setupSpeechRecognitionHandlers(): void {
    if (!this.recognition) {
      return;
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.handleSpeechRecognitionResult(event);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.handleSpeechRecognitionError(event);
    };

    this.recognition.onend = () => {
      this.handleSpeechRecognitionEnd();
    };
  }

  private handleSpeechRecognitionResult(event: SpeechRecognitionEvent): void {
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      }
    }

    if (finalTranscript) {
      this.text += finalTranscript;
      this.onTextChange();
      this.cdr.markForCheck();
    }
  }

  private handleSpeechRecognitionError(event: SpeechRecognitionErrorEvent): void {
    if (event.error === 'no-speech') {
      this.toastService.showError('Speech Error', 'No speech detected. Please try again.');
    }
    this.isRecording = false;
    this.cdr.markForCheck();
  }

  private handleSpeechRecognitionEnd(): void {
    if (this.isRecording) {
      this.recognition?.start();
    }
  }

  public onTextChange(): void {
    this.textChange.emit(this.text);
  }

  public toggleRecording(): void {
    if (!this.isRecognitionSupported || !this.recognition) {
      this.toastService.showError(
        'Speech Error',
        'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
      );
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private startRecording(): void {
    try {
      this.recognition?.start();
      this.isRecording = true;
      this.cdr.markForCheck();
    } catch {
      this.toastService.showError('Speech Error', 'Error starting speech recognition');
    }
  }

  private stopRecording(): void {
    this.recognition?.stop();
    this.isRecording = false;
    this.cdr.markForCheck();
  }

  public applyFormat(format: string): void {
    const element = this.textarea.nativeElement;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selectedText = this.text.substring(start, end);

    const formattedText = this.getFormattedText(format, selectedText);
    this.text = this.text.substring(0, start) + formattedText + this.text.substring(end);

    this.focusAndSetCursor(element, start, formattedText.length);
  }

  private getFormattedText(format: string, text: string): string {
    switch (format) {
      case 'italic':
        return `*${text}*`;
      case 'bold':
        return `**${text}**`;
      case 'underline':
        return `__${text}__`;
      case 'strikethrough':
        return `~~${text}~~`;
      case 'code':
        return `\`${text}\``;
      default:
        return text;
    }
  }

  private focusAndSetCursor(
    element: HTMLTextAreaElement,
    start: number,
    formattedLength: number,
  ): void {
    setTimeout(() => {
      element.focus();
      element.setSelectionRange(start + formattedLength, start + formattedLength);
    }, 0);
  }
}
