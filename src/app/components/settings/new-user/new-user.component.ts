import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  form = new FormGroup({
    name: new FormControl(''),
    gender: new FormControl(''),
    dob: new FormControl(null),
    agree: new FormControl(false),
    role: new FormControl(''),
    subscribe: new FormControl(true)
  });

/*
  
  fields = [
    

    // Row 1 – 2 columns
    { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6 },
    { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6 },
    // Row 2 – full width
    { type: 'input', name: 'userName', label: 'User Name', colSpan: 12 },
    // Row 2 – 2 columns
    { type: 'input', name: 'email', label: 'Email', colSpan: 6 },
    { type: 'input', name: 'phone', label: 'Phone', colSpan: 6 },

    // Row 3 – 3 columns
    { type: 'input', name: 'city', label: 'City', colSpan: 4 },
    { type: 'input', name: 'state', label: 'State', colSpan: 4 },
    { type: 'input', name: 'zip', label: 'Zip Code', colSpan: 4 }
  ];

  */

  // fields = [
  //   { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6 },
  //   { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6 },
  //   { type: 'input', name: 'email', label: 'Email Id' },
  //   {
  //     type: 'select', name: 'gender', label: 'Gender', options: [
  //       { value: 'male', label: 'Male' },
  //       { value: 'female', label: 'Female' }
  //     ]
  //   },
  //   { type: 'date', name: 'dob', label: 'Date of Birth' },
  //   {
  //     type: 'radio', name: 'role', label: 'Role', options: [
  //       { value: 'admin', label: 'Admin' },
  //       { value: 'user', label: 'User' }
  //     ]
  //   },
  //   { type: 'toggle', name: 'subscribe', label: 'Subscribe to Newsletter' }
  // ];

  fields = [
  { type: 'input', name: 'fullName', label: 'Full Name', colSpan: 12 },
  { type: 'input', name: 'email', label: 'Email', colSpan: 6 },
  { type: 'password', name: 'password', label: 'Password', colSpan: 6 },
  { type: 'input', name: 'city', label: 'City', colSpan: 4 },
  { type: 'select', name: 'state', label: 'State', colSpan: 4, options: [
      { label: 'Tamil Nadu', value: 'TN' },
      { label: 'Kerala', value: 'KL' },
      { label: 'Karnataka', value: 'KA' },
    ]
  },
  { type: 'input', name: 'zip', label: 'Zip Code', colSpan: 4 },
  { type: 'checkbox', name: 'subscribe', label: 'Subscribe to newsletter', colSpan: 12 },
  { type: 'radio', name: 'gender', label: 'Gender', colSpan: 6, options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ]
  },
  { type: 'toggle', name: 'active', label: 'Is Active?', colSpan: 6 },
  { type: 'date', name: 'dob', label: 'Date of Birth', colSpan: 12 }
];


}
