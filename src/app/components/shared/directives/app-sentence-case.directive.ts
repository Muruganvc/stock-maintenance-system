import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAppSentenceCase]',
  standalone: true
})
export class AppSentenceCaseDirective {

   constructor(private control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const updated = this.toTitleCase(value);
    if (value !== updated) {
      this.control.control?.setValue(updated, { emitEvent: false });
    }
  }

  private toTitleCase(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
