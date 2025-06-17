import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { IUser } from '../models/IUser';
import { IUserList } from '../models/IUserList';

import { ApiResponse } from '../models/ApiResponse';
import { IChangePasswordRequest, IUpdateUserRequest } from '../models/IUpdateUserRequest ';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly api: ApiService) { }

  createUser(user: IUser): Observable<number> {
    return this.api
      .post<IUser, number>('new-user', user)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

  updateUser(userId: number, user: IUpdateUserRequest): Observable<boolean> {
    return this.api
      .put<IUpdateUserRequest, boolean>(`update/${userId}`, user)
      .pipe(map((res: ApiResponse<boolean>) => res.data));
  }

  changePassword(
    userId: number,
    user: IChangePasswordRequest
  ): Observable<boolean> {
    return this.api
      .put<IChangePasswordRequest, boolean>(`password-change/${userId}`, user)
      .pipe(map((res: ApiResponse<boolean>) => res.data));
  }

  getUsers(): Observable<IUserList[]> {
    return this.api
      .get<IUserList[]>('users')
      .pipe(map((res: ApiResponse<IUserList[]>) => res.data));
  }
}
