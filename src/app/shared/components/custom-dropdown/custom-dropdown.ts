import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.html',
  styleUrl: './custom-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CustomDropdown {
  constructor(private readonly elementRef: ElementRef) {}

  public options = input.required<string[]>();
  public selectedValue = input<string | undefined>();
  public placeholder = input<string>('Select an option');
  public selectionChange = output<string>();

  public isOpen = signal(false);

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    if (event.target && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  public toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  public selectOption(option: string): void {
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }
}
