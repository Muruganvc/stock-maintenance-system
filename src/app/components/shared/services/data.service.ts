import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { ILoginResponse } from '../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSource = new BehaviorSubject<any>(null);
  currentData$ = this.dataSource.asObservable();

  updateData(data: any): void {
    this.dataSource.next(data);
  }

  private currentUser = new BehaviorSubject<ILoginResponse | null>(null);
  currentUser$ = this.currentUser.asObservable();

  updateCurrentUser(data: ILoginResponse): void {
    this.currentUser.next(data);
  }


  constructor(private readonly snackBar: MatSnackBar){}
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

}
