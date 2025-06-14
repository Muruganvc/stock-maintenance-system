import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
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
    MatButtonModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields: any[] = [];
  title = input.required<string>();
  @Output() cancelEvent = new EventEmitter<string>();

  ngOnInit() {
    for (const field of this.fields) {
      if (!this.formGroup.contains(field.name)) {
        this.formGroup.addControl(field.name, new FormControl(''));
      }
    }
  }

  submitForm() {
    console.log(this.formGroup.value);
  }
  cancel = () => {
    this.cancelEvent.emit('cancel');
  }
}
