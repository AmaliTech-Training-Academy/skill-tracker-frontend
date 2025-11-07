import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.html',
  styleUrl: './custom-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CustomDropdown {
  public options = input.required<string[]>();
  public selectedValue = input<string | undefined>();
  public placeholder = input<string>('Select an option');
  public selectionChange = output<string>();

  public isOpen = signal(false);

  public toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  public selectOption(option: string): void {
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }

  public closeDropdown(): void {
    this.isOpen.set(false);
  }
}
