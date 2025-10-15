import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { ToastConfig } from 'src/app/core/models/toast-model';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  @Input() config!: ToastConfig;
  @Input() show = signal(false);
  @Input() exiting = signal(false);
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.show.set(false);
    this.close.emit();
  }
}
