// dynamic-form.component.ts
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { AppNumberOnlyDirective } from '../directives/app-number-only.directive';
import { Observable, map, startWith } from 'rxjs';
import { AppSentenceCaseDirective } from '../directives/app-sentence-case.directive';
import { SearchableSelectComponent } from '../search-dropdown/searchable-select.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [FormsModule,
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
  @Output() selectionChange = new EventEmitter<{controlName : string, matSelectChange : MatSelectChange}>();
  @Input({ required: true }) submitBtntitle!: string;

  filteredOptions: { [key: string]: Observable<any[]> } = {};

  constructor(private cdr: ChangeDetectorRef) { }

  getValue(key: string): any {
    return this.formGroup.get(key)?.value;
  }

  // ngOnInit(): void {
  //   this.fields.forEach(field => {
  //     const defaultValue = this.getDefaultFieldValue(field); // Get default value before adding control
  //     this.formGroup.addControl(field.name, new FormControl(defaultValue));

  //     if (field.type === 'autocomplete' && Array.isArray(field.options)) {
  //       const control = this.formGroup.get(field.name) as FormControl;
  //       this.filteredOptions[field.name] = control.valueChanges.pipe(
  //         startWith(''),
  //         map(value => this._filter(value, field.options))
  //       );
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.fields.forEach(field => {
      // Only add the control if it's not already in the formGroup
      if (!this.formGroup.get(field.name)) {
        this.formGroup.addControl(field.name, new FormControl(null));
      }

      // Setup filtered options for searchable selects or autocomplete
      if (['autocomplete', 'searchable-select'].includes(field.type) && Array.isArray(field.options)) {
        const control = this.formGroup.get(field.name) as FormControl;
        this.filteredOptions[field.name] = control.valueChanges.pipe(
          startWith(control.value || ''),
          map(value => this._filter(value, field.options))
        );
      }
    });
  }



  private getDefaultFieldValue(field: any): any {
    if (!field.defaultValue) return null;
    if (['autocomplete', 'searchable-select'].includes(field.type)) {
      return field.options?.find((opt: any) => opt.value === field.defaultValue) ?? null;
    }
    return field.defaultValue;
  }

  private _filter(value: string | any, options: any[]): any[] {
    if (!value || !options?.length) return [];
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.label?.toLowerCase() || '';
    return options.filter(opt => opt.label?.toLowerCase().includes(filterValue));
  }

  displayFn(value: any): string {
    return typeof value === 'object' ? value.label ?? '' : '';
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.submitEvent.emit(this.formGroup);
    }
  }

  cancel() {
    this.cancelEvent.emit();
  }

  matSelectionChange(controlName: string, event: MatSelectChange){
    this.selectionChange.emit({ controlName: controlName, matSelectChange: event });
  }

} // end component