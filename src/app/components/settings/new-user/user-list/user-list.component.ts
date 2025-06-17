import { Component, OnInit } from '@angular/core';
import { CustomTableComponent } from "../../../shared/custom-table/custom-table.component";
import { IUser } from '../../../shared/models/IUser';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { IUserList } from '../../../shared/models/IUserList';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  // user: IUser[] = [];
  userList: IUserList[] = [];
  constructor(private router: Router, private userService: UserService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.getAllUser();
  }

  columns: { key: string; label: string; align: 'left' | 'center' | 'right' }[] = [
    { key: 'firstName', label: 'First Name', align: 'left' },
    { key: 'LastName', label: 'Last Name', align: 'right' },
    { key: 'userName', label: 'User Name', align: 'right' },
    { key: 'email', label: 'Email Id', align: 'right' },
    { key: 'mobileNumber', label: 'Mobile Number', align: 'right' },
    { key: 'role', label: 'Role', align: 'right' },
    { key: 'isActive', label: 'Active', align: 'right' },
    { key: 'superAdmin', label: 'Super Admin', align: 'right' }
  ];

  onEdit(user: IUserList) {
    this.router.navigate(['/setting/add-user'], {
      state: { user }
    });
  }


  getAllUser() {
    this.userService.getUsers().subscribe({
      next: result => {
        this.userList = result.map(a => {
          const data = a as IUserList;
          return data
        })
      }
    });
  }
  onDelete(user: IUserList) {
    // this.products = this.products.filter(u => u.id !== user.id);
    this.openConfirm(user['key']);
  }

  openConfirm(key: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.userService.delete(key);
      }
    });
  }
  cancel(a: any): void {
    this.router.navigate(['/product-list']);
  }
  newOpen(a: any) {
    // this.router.navigate(['/new-user']);
    this.router.navigate(['/setting/add-user']);
  }

}
