import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true
})
export class AppNumberOnlyDirective {

  @Input() appNumberOnly = true;

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    if (!this.appNumberOnly) return;

    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove non-numeric and non-dot characters
    value = value.replace(/[^0-9.]/g, '');

    // Allow only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }

    // Limit decimal places to 2
    if (parts[1]?.length > 2) {
      parts[1] = parts[1].substring(0, 2);
      value = parts.join('.');
    }

    input.value = value;
    input.dispatchEvent(new Event('input')); // update ngModel/FormControl
  }
}