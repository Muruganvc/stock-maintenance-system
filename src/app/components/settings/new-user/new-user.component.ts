import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';


@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {

  form: FormGroup;
  constructor() {
    this.form = new FormGroup({
      firstName: new FormControl('Muruganvc', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userName: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      mobileNumner: new FormControl('', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('admin', [Validators.required]),
      isActice: new FormControl(true),
      superAdmin: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // this.http.get<any>('https://api.example.com/user/123')
    //   .subscribe(user => {

    //   });

    this.form.patchValue({
      firstName: 'Murugan',
      lastName: 'Chidambaram',
      emailId: 'vcmuruganmca@gmail.com',
      mobileNumber: '9994277980',
      role: 'admin',
      isActive: true,
      superAdmin: true
    });
  }

  fields = [
    { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6 },
    { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6 },
    { type: 'input', name: 'userName', label: 'User Name', colSpan: 12 },
    { type: 'input', name: 'emailId', label: 'Email', colSpan: 6 },
    { type: 'input', name: 'mobileNumber', label: 'Mobile Number', colSpan: 6 },
    { type: 'password', name: 'password', label: 'Password', colSpan: 6 },
    { type: 'password', name: 'confirmPassword', label: 'Confirm Password', colSpan: 6 },

    {
      type: 'radio',
      name: 'role',
      label: 'Role',
      colSpan: 4,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ]
    },

    // {
    //   type: 'select',
    //   name: 'state',
    //   label: 'State',
    //   colSpan: 12,
    //   options: [
    //     { label: 'Tamil Nadu', value: 'TN' },
    //     { label: 'Kerala', value: 'KL' },
    //     { label: 'Karnataka', value: 'KA' },
    //   ]
    // },

    { type: 'checkbox', name: 'isActive', label: 'Active', colSpan: 4 },
    { type: 'toggle', name: 'superAdmin', label: 'Super Admin', colSpan: 4 }
  ];

}
