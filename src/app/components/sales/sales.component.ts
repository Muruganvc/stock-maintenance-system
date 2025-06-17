import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    DropdownModule, MatIconModule
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit {
  @ViewChild('companySelect') companySelect!: MatSelect;

  // Reactive form control
  companyControl = new FormControl();
  filterControl = new FormControl('');

  // Country list (key-value objects)
  countries = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'India', code: 'IN' },
    { name: 'United States', code: 'US' }
  ];

  filteredCountries = [...this.countries];
  countryFilter: string = '';

  ngOnInit(): void {
    // Set default selected country (India here)
    const defaultCountry = this.countries.find(c => c.code === 'IN');
    this.companyControl.setValue(defaultCountry);

    // Initially set filtered countries
    this.filteredCountries = [...this.countries];
  }

  // Called on dropdown open
  onOpen(opened: boolean): void {
    if (opened) {
      this.countryFilter = '';
      this.filteredCountries = [...this.countries];
      setTimeout(() => {
        const inputEl = document.querySelector<HTMLInputElement>('input[matinput]');
        inputEl?.focus(); // autofocus the input
      });
    }
  }

  // Filter countries based on user input
  filterCountries(): void {
    const filterValue = this.countryFilter.toLowerCase();
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  // Button click example (optional)
  handleClick() {
    console.log('Button clicked!');
  }
}
