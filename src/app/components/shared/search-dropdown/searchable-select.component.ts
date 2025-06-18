import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatOptionModule],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.scss',
})
export class SearchableSelectComponent implements AfterViewInit {
  @Input() label: string = '';
  @Input() placeholder: string = 'Search...';
  @Input() options: {label: string; value: string}[] = [];
  
  @Input() control!: FormControl;
  @Output() selectionChange = new EventEmitter<{ label: string; value: string }>();

  searchText: string = '';
  filteredOptions: { label: string; value: any }[] = [];

  activeIndex = 0;

  @ViewChild('searchBoxInput') searchBoxInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatSelect) matSelect!: MatSelect;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filteredOptions = this.options;
    });
    this.control.setValue(1);
  }

  onDropdownOpened(isOpen: boolean): void {
    if (isOpen) {
      this.searchText = '';
      this.filterOptions('');
      setTimeout(() => this.searchBoxInput?.nativeElement.focus());
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
      if (selected) this.onSelectionChange(selected.value);
    }
  }

  // filterOptions(): void {
  //   const lower = this.searchText.toLowerCase();
  //   this.filteredOptions = this.options.filter(opt =>
  //     opt.value.toLowerCase().includes(lower) || opt.key.toLowerCase().includes(lower)
  //   );
  //   this.activeIndex = 0;
  // }
 
  filterOptions(searchText: string): void {
  const lowerSearch = searchText?.toLowerCase();

  this.filteredOptions = this.options?.filter(opt => {
    const label = opt?.label ?? ''; // fallback to empty string if label is null/undefined
    return label?.toLowerCase().includes(lowerSearch);
  });
}

  onSelectionChange(value: string): void {
    this.control.setValue(value);
    const selected = this.options.find(opt => opt.value === value);
    if (selected) this.selectionChange.emit(selected);
    this.matSelect.close();
  }
}