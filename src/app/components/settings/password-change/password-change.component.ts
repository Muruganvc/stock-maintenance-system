import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DynamicFormComponent } from "../../shared/dynamic-form/dynamic-form.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { UserService } from '../../shared/services/user.service';
import { IChangePasswordRequest } from '../../shared/models/IUpdateUserRequest ';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, DynamicFormComponent], templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss'
})
export class PasswordChangeComponent implements OnInit {
  constructor(private readonly dataService: DataService, private readonly userService : UserService) { }
  form: FormGroup;
  ngOnInit(): void {

    this.dataService.currentData$.subscribe(result => {
    });

    this.form = new FormGroup({
      userName: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      currentPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  cancel(a:any){
    
  }

  updatePassword(form: FormGroup) {
    if (form.invalid) return;
    const value = form.value;
    if (value.newPassword !== value.confirmPassword) {
      this.dataService.showErrorMessage('Password and Confirm Password do not match.');
      return;
    }
    var pwdChange: IChangePasswordRequest = {
      userName: value.userName,
      passwordHash: value.newPassword,
      currentPassword: value.currentPassword,
      email:value.email
    }

    this.userService.changePassword(1, pwdChange).subscribe({
      next: result => {
          if(result){
            this.dataService.showSuccessMessage('Password Changed.');
          }
      }
    });
  }
  fields = [
    { type: 'input', name: 'userName', label: 'User Name', colSpan: 6 },
    { type: 'input', name: 'email', label: 'Email Id', colSpan: 6 },
    { type: 'password', name: 'currentPassword', label: 'Current Password', colSpan: 4 },
    { type: 'password', name: 'newPassword', label: 'New Password', colSpan: 4 },
    { type: 'password', name: 'confirmPassword', label: 'Confirm Password', colSpan: 4 },
  ];

}
