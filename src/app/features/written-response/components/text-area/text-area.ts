import { Component, ViewChild, ElementRef, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
    this.isRecording = !this.isRecording;
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