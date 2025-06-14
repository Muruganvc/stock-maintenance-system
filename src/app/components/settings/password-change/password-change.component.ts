import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DynamicFormComponent } from "../../shared/dynamic-form/dynamic-form.component";
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, DynamicFormComponent], templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss'
})
export class PasswordChangeComponent {
  form = new FormGroup({
    name: new FormControl(''),
    gender: new FormControl(''),
    dob: new FormControl(null),
    agree: new FormControl(false),
    role: new FormControl(''),
    subscribe: new FormControl(true)
  });
 
  fields = [
    { type: 'input', name: 'userName', label: 'User Name', colSpan: 12 },
    { type: 'input', name: 'mobileNumber', label: 'Mobile Number', colSpan: 6 },
    { type: 'input', name: 'emailId', label: 'Email Id', colSpan: 6 },
    { type: 'password', name: 'currentPassword', label: 'Current Password', colSpan: 4 },
    { type: 'password', name: 'newPassword', label: 'New Password', colSpan: 4 },
    { type: 'password', name: 'confirmPassword', label: 'Confirm Password', colSpan: 4 },
  ];
}
