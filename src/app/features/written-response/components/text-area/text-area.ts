import { Component, ViewChild, ElementRef, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-area.html',
  styleUrl: './text-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextArea implements OnInit, OnChanges {
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  @Input() textValue: string = '';

  text: string = '';
  isRecording: boolean = false;
  @Output() textChange = new EventEmitter<string>();

  private recognition: any;
  private isRecognitionSupported: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.isRecognitionSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      // Handle speech recognition results
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          this.text += finalTranscript;
          this.onTextChange();
          this.cdr.markForCheck();
        }
      };

      // Handle errors
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected. Please try again.');
        }
        this.isRecording = false;
        this.cdr.markForCheck();
      };

      // Handle when recognition ends
      this.recognition.onend = () => {
        if (this.isRecording) {
          // Restart if still in recording mode
          this.recognition.start();
        }
      };
    }
  }

  ngOnInit(): void {
    this.text = this.textValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textValue'] && changes['textValue'].currentValue !== undefined) {
      this.text = changes['textValue'].currentValue;
    }
  }
  
  onTextChange(): void {
    this.textChange.emit(this.text);
  }

  toggleRecording(): void {
    if (!this.isRecognitionSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (this.isRecording) {
      // Stop recording
      this.recognition.stop();
      this.isRecording = false;
    } else {
      // Start recording
      try {
        this.recognition.start();
        this.isRecording = true;
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    // Clean up speech recognition
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  }

  applyFormat(format: string): void {
    const element = this.textarea.nativeElement;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selectedText = this.text.substring(start, end);

    let formattedText = '';

    switch (format) {
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      default:
        formattedText = selectedText;
    }

    this.text = this.text.substring(0, start) + formattedText + this.text.substring(end);

    setTimeout(() => {
      element.focus();
      element.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  }
}