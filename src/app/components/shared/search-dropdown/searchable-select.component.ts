import { CommonModule } from '@angular/common';
import {
  Component, Input, Output, EventEmitter, ElementRef,
  ViewChild, forwardRef, AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { KeyValuePair } from '../models/IKeyValuePair';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule
  ],
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  @Input() label: string = '';
  @Input() placeholder: string = 'Search...';
  // @Input() options: { label: string; value: any }[] = [];
  @Input() options: KeyValuePair[] = [];

  @Output() selectionChange = new EventEmitter<MatSelectChange>();

  @ViewChild('searchBoxInput') searchBoxInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatSelect) matSelect!: MatSelect;

  searchText: string = '';
  // filteredOptions: { label: string; value: any }[] = [];
  filteredOptions: KeyValuePair[] = [];
  value: any = null;
  activeIndex: number = 0;

  private pendingValue: any = null;

  onChange = (_: any) => { };
  onTouched = () => { };

  ngAfterViewInit(): void {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) {
      this.filteredOptions = [...this.options];
      if (this.pendingValue) {
        const matched = this.options.find(o => this.compareFn(o, this.pendingValue));
        this.value = matched ?? this.pendingValue;
        this.onChange(this.value);
        this.pendingValue = null;
      } else if (this.value) {
        const matched = this.options.find(o => this.compareFn(o, this.value));
        if (matched) {
          this.value = matched;
          this.onChange(this.value);
        }
      }
    }
  }

  writeValue(obj: any): void {
    if (!obj || (!obj.label && !obj.value)) {
      this.value = null;
      return;
    }

    if (obj.value && obj.value.label && obj.value.value !== undefined) {
      obj = obj.value;
    }

    const matched = this.options.find(o => this.compareFn(o, obj));
    this.value = matched ?? obj;
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDropdownOpened(isOpen: boolean): void {
    if (isOpen) {
      this.searchText = '';
      this.filterOptions('');
      setTimeout(() => this.searchBoxInput?.nativeElement?.focus(), 0);
    }
  }

  filterOptions(searchText: string): void {
    if (!this.options?.length) return;

    const lower = searchText.toLowerCase();
    this.filteredOptions = this.options.filter(opt =>
      opt.key?.toLowerCase().includes(lower) ||
      opt.value?.toString().toLowerCase().includes(lower)
    );
    this.activeIndex = 0;
  }

  onKeyDown(event: KeyboardEvent): void {
    const length = this.filteredOptions.length;
    if (!length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + length) % length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredOptions[this.activeIndex];
      if (selected) {
        this.setValue(selected);
      }
    }
  }

  onSelectionChange(event: MatSelectChange): void {
    const clickedOption = event.value;
    const isSame = this.compareFn(this.value, clickedOption);
    this.value = clickedOption;

    if (isSame) {
      this.setValue(null);
      // this.selectionChange.emit({ value: null } as MatSelectChange);
      this.matSelect.writeValue(null);
    } else {
      this.setValue(clickedOption);
      // this.selectionChange.emit(event);
    }

    this.matSelect.close();
  }

  onOptionClicked(option: any): void {
    if (this.compareFn(this.value, option)) {
      this.setValue(null);
      // this.selectionChange.emit({ value: null } as MatSelectChange);
      this.matSelect.writeValue(null);
    } else {
      this.setValue(option);
      // this.selectionChange.emit({ value: option } as MatSelectChange);
    }
    this.matSelect.close();
  }

  setValue(selected: any): void {
    this.value = selected;
    this.onChange(this.value);
    this.onTouched();
  }

  compareFn = (a: any, b: any): boolean => {
    return a?.value === b?.value;
  };
}
