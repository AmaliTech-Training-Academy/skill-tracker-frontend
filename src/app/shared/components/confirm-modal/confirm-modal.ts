import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModal {
  public readonly confirmSubmit = output<void>();
  public readonly cancelSubmit = output<void>();

  public onConfirm(): void {
    this.confirmSubmit.emit();
  }

  public onCancel(): void {
    this.cancelSubmit.emit();
  }
}
