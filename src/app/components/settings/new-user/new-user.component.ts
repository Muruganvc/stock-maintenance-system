import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { UserService } from '../../shared/services/user.service';
import { IUser } from '../../shared/models/IUser';
import { FormMode } from '../../shared/models/formMode';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { encryptPassword } from '../../shared/common';
import { IUpdateUserRequest } from '../../shared/models/IUpdateUserRequest ';
import { Observable } from 'rxjs';
import { IUserList } from '../../shared/models/IUserList';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormComponent, MatSnackBarModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent implements OnInit {
  form: FormGroup;
  submitBtntitle = 'Submit';
  formMode: FormMode = 'new';
  user: IUserList | null = null;
  fields: any[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
  }

  private loadFormControls(): void {
    const passwordValidators = this.formMode === 'new' ? [Validators.required, Validators.minLength(6)] : [];
    const confirmPasswordValidators = this.formMode === 'new' ? [Validators.required] : [];

    this.form = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      userName: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobileNumner: new FormControl(null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      password: new FormControl(null, passwordValidators),
      confirmPassword: new FormControl(null, confirmPasswordValidators),
      role: new FormControl(null),
      isActive: new FormControl(null),
      superAdmin: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.user = history.state['user'] ?? null;
    this.formMode = this.user ? 'edit' : 'new';
    this.loadFormControls();
    if (this.user) {
      this.submitBtntitle = 'Update';
      this.form.patchValue(this.user);
    }
    this.loadConfiguration();
  }
  private loadConfiguration(): void {
    const isEdit = this.formMode === 'edit';
    this.fields = [
      { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6, isReadOnly: !isEdit, isHidden: false },
      { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6, isReadOnly: !isEdit, isHidden: false },
      { type: 'input', name: 'userName', label: 'User Name', colSpan: 12, isReadOnly: isEdit, isHidden: false },
      { type: 'input', name: 'email', label: 'Email', colSpan: 6, isReadOnly: !isEdit, isHidden: false },
      { type: 'input', name: 'mobileNumner', label: 'Mobile Number', colSpan: 6, isReadOnly: !isEdit, isHidden: false },
      { type: 'password', name: 'password', label: 'Password', colSpan: 6, isReadOnly: isEdit, isHidden: isEdit },
      { type: 'password', name: 'confirmPassword', label: 'Confirm Password', colSpan: 6, isReadOnly: isEdit, isHidden: isEdit },
      {
        type: 'radio',
        name: 'role',
        label: 'Role',
        colSpan: 4,
        isReadOnly: isEdit,
        isHidden: false,
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ]
      },
      { type: 'checkbox', name: 'isActive', label: 'Active', colSpan: 4, isReadOnly: isEdit, isHidden: false },
      { type: 'toggle', name: 'superAdmin', label: 'Super Admin', colSpan: 4, isReadOnly: isEdit, isHidden: false }
    ];
  }

  handleSubmit(form: FormGroup): void {
    if (form.invalid) return;

    const value = form.value;

    if (this.formMode === 'new' && value.password !== value.confirmPassword) {
      this.showErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    const commonPayload = {
      firstName: value.firstName,
      lastName: value.lastName,
      emailId: value.email,
      mobileNumber: value.mobileNumner,
      isActive: value.isActive ?? false,
      superAdmin: value.superAdmin ?? false
    };

    const action$: Observable<boolean | number> = this.formMode === 'new'
      ? this.userService.createUser({
        id: '',
        userName: value.userName,
        password:  value.password,
        role: value.role,
        ...commonPayload
      })
      : this.userService.updateUser(Number(this.user?.userId), {
        ...commonPayload,
        isSuperAdmin: commonPayload.superAdmin
      });

    action$.subscribe({
      next: () => {
        const msg = this.formMode === 'new' ? 'User created successfully.' : 'User updated successfully.';
        this.showSuccessMessage(msg);
        this.router.navigate(['/setting/user-list']);
      },
      error: (err) => {
        this.showErrorMessage('Error: ' + (err?.message || 'Unknown error.'));
      }
    });
  }

  showSuccessMessage(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['success-snackbar']
    });
  }

  showErrorMessage(msg: string): void {
    this.snackBar.open(msg, 'Dismiss', {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar']
    });
  }

  cancel(a: any): void {
    this.router.navigate(['/setting/user-list']);
  }
}
