import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocomplete } from '@angular/material/autocomplete';

import { AppNumberOnlyDirective } from '../directives/app-number-only.directive';
import { Observable, map, startWith } from 'rxjs';
import { AppSentenceCaseDirective } from '../directives/app-sentence-case.directive';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    AppNumberOnlyDirective, AppSentenceCaseDirective
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields: any[] = [];
  @Output() cancelEvent = new EventEmitter();
  @Input({ required: true }) title!: string;
  @Output() submitEvent = new EventEmitter<FormGroup>();
  @Input({ required: true }) submitBtntitle!: string;

  filteredOptions: { [key: string]: Observable<string[]> } = {};
  autoRefs: { [key: string]: MatAutocomplete } = {};
  constructor(private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    // Ensure Angular re-checks the template with the latest filteredOptions bindings
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.fields.forEach(field => {
      this.formGroup.addControl(field.name, new FormControl(null));

      if (field.type === 'autocomplete' && field.options) {
        const control = this.formGroup.get(field.name)!;
        this.filteredOptions[field.name] = control.valueChanges.pipe(
          startWith(''),
          map(value => value || ''),
          map(value =>
            value.length >= 2 ? this._filter(value, field.options) : []
          )
        );
      }
    });

    this.setupFieldMirroring();
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  displayFn(value: string): string {
    return value ?? '';
  }

  registerAuto(name: string, ref: MatAutocomplete): boolean {
    this.autoRefs[name] = ref;
    return true;
  }

  onAutoCompleteSelect(event: any, fieldName: string) {
    // Optional hook for selection logic
    // console.log('Selected:', event.option.value, 'for', fieldName);
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.submitEvent.emit(this.formGroup);
    }
  }

  cancel (){
     this.cancelEvent.emit();
  }

  private setupFieldMirroring() {
    this.fields.forEach(field => {
      if (field.mirrorTo) {
        const source = this.formGroup.get(field.name);
        const target = this.formGroup.get(field.mirrorTo);
        if (source && target) {
          let previous = 0;
          source.valueChanges.subscribe(val => {
            const current = Number(val) || 0;
            const delta = current - previous;
            const total = Number(target.value) || 0;
            target.setValue(total + delta, { emitEvent: false });
            previous = current;
          });
        }
      }
    });
  }
}
