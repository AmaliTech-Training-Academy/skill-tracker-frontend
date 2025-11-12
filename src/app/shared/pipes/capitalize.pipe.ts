import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  public transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    if (typeof value !== 'string') {
      return String(value);
    }

    const lower = value.toLowerCase();

    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
}
