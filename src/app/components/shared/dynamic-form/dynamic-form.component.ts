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
import { MatAutocompleteModule, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { AppNumberOnlyDirective } from '../directives/app-number-only.directive';
import { Observable, map, startWith } from 'rxjs';
import { AppSentenceCaseDirective } from '../directives/app-sentence-case.directive';
import { SearchableSelectComponent } from "../search-dropdown/searchable-select.component";

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
    AppNumberOnlyDirective, AppSentenceCaseDirective,
    SearchableSelectComponent
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

  filteredOptions: { [key: string]: Observable<any[]> } = {};
  autoRefs: { [key: string]: any } = {};

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    if (!this.fields || this.fields.length === 0) return;

    this.fields.forEach(field => {
      this.formGroup.addControl(field.name, new FormControl(null));

      if (field.type === 'autocomplete' && Array.isArray(field.options)) {
        const control = this.formGroup.get(field.name) as FormControl;

        this.filteredOptions[field.name] = control.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, field.options))
        );

        if (field.defaultKey !== undefined) {
          const defaultOption = field.options.find(
            (opt: any) => opt.value === field.defaultKey
          );
          if (defaultOption) {
            control.setValue(defaultOption);
          }
        }
      }
    });

    this.setupFieldMirroring();
  }

  private _filter(value: string | any, options: any[]): any[] {
    if (!value || !options?.length) return [];
    const filterValue =
      typeof value === 'string' ? value.toLowerCase() : value.label?.toLowerCase() || '';
    return options.filter(opt => opt.label?.toLowerCase().includes(filterValue));
  }

  displayFn(value: any): string {
    if (!value) return '';
    if (typeof value === 'object') {
      return value.label ?? value.name ?? value.value ?? '';
    }
    return '';
  }

  registerAuto(name: string, ref: any): boolean {
    this.autoRefs[name] = ref;
    return true;
  }

  onAutoCompleteSelect(event: MatAutocompleteSelectedEvent, fieldName: string): void {
    const selected = event.option.value;
    this.formGroup.get(fieldName)?.setValue(selected);
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.submitEvent.emit(this.formGroup);
    }
  }

  cancel() {
    this.cancelEvent.emit();
  }
  getControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl;
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
