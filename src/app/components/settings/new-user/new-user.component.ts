import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { UserService } from '../../shared/services/user.service';
import { IUser } from '../../shared/models/IUser';
import { FormMode } from '../../shared/models/formMode';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormComponent, MatSnackBarModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  form: FormGroup;
  submitBtntitle: string = 'Submit';
  formMode: FormMode = 'new';
  user: IUser;
  constructor(private userService: UserService, private snackBar: MatSnackBar, private router: Router) {
    this.form = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      emailId: new FormControl(null, [Validators.required, Validators.email]),
      mobileNumner: new FormControl(null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      isActice: new FormControl(null),
      superAdmin: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.user = history.state['user'] ?? null;
    if (this.user) {
      this.formMode = 'edit';
      this.submitBtntitle = 'Update';
      this.form.patchValue(this.user);
    }
    // this.loadUserData();
  }

  loadUserData(): void {
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
    { type: 'input', name: 'mobileNumner', label: 'Mobile Number', colSpan: 6 },
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
    { type: 'checkbox', name: 'isActive', label: 'Active', colSpan: 4 },
    { type: 'toggle', name: 'superAdmin', label: 'Super Admin', colSpan: 4 }
  ];
  handleSubmit(form: FormGroup): void {
    if (form.invalid) return;

    const value = form.value;

    if (value.password !== value.confirmPassword) {
      this.showErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    const newUser: IUser = {
      id: '',
      firstName: value.firstName,
      lastName: value.lastName,
      userName: value.userName,
      emailId: value.emailId,
      mobileNumner: value.mobileNumner,
      password: value.password,
      role: value.role,
      isActice: value.isActice ?? true,
      superAdmin: value.superAdmin ?? false,
      mobileNumber: value.mobileNumner, // fixed typo/duplicate
      isActive: value.isActice ?? true  // align with `isActice`
    };

    this.userService.getByUserName(value.userName).valueChanges().subscribe(users => {
      if (users.length > 0) {
        this.showErrorMessage('User already exists.');
        return;
      }
      if (this.formMode === 'new') {
        this.userService.create(newUser).then(() => {
          this.showSuccessMessage('New user created.');
          form.reset(); // optional: reset form after create
        }).catch(err => {
          this.showErrorMessage('Failed to create user.');
          console.error(err);
        });
      }
      else if (this.formMode === 'edit') {
        this.userService.update(this.user['key'], newUser).then(() => {
          this.showSuccessMessage('User details updated.');
        }).catch(err => {
          this.showErrorMessage('Failed to update user.');
          console.error(err);
        });
      }

    });
    this.router.navigate(['/setting/user-list']);
  }

  showSuccessMessage(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['success-snackbar']
    });
  }

  showErrorMessage(msg: string) {
    this.snackBar.open(msg, 'Dismiss', {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar']
    });
  }
  cancel(a: any) {
    this.router.navigate(['/setting/user-list']);
  }
}
