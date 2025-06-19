import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule
  ],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label: string = '';
  @Input() placeholder: string = 'Search...';
  @Input() options: { label: string; value: any }[] = [];
  @Output() selectionChange = new EventEmitter<MatSelectChange>();
  // @Input({ required: true }) formGroup!: FormGroup;

  @ViewChild('searchBoxInput') searchBoxInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatSelect) matSelect!: MatSelect;

  searchText: string = '';
  filteredOptions: { label: string; value: any }[] = [];

  value: any = null;
  activeIndex: number = 0;

  onChange = (_: any) => { };
  onTouched = () => { };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filteredOptions = [...this.options];
    });
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.value) {
      this.filteredOptions = [...this.options];
      this.onChange(this.value);
    }
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
        this.value = selected.value;
        this.onChange(selected.value);
        this.onTouched();
        // Remove 
        //  this.matSelect.close();
      }
    }
  }


  filterOptions(searchText: string): void {
    const lower = searchText?.toLowerCase() ?? '';
    this.filteredOptions = this.options.filter(opt =>
      opt.label?.toLowerCase().includes(lower) ||
      opt.value?.toString().toLowerCase().includes(lower)
    );
    this.activeIndex = 0;
  }

  onSelectionChange(value: MatSelectChange): void {
    this.value = value.value;
    this.onChange(value.value);
    this.onTouched();
    this.matSelect.close();
    this.selectionChange.emit(value);
  }
}
