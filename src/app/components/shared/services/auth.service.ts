import { Injectable } from '@angular/core';
import { ILoginRequest, ILoginResponse, IUser } from '../models/IUser';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { map, Observable, of, take } from 'rxjs';
import { ApiService } from './api.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: ILoginResponse | null = null;
  constructor(private apiService: ApiService, private router: Router, private dataService : DataService) { }
  login(username: string, password: string): Observable<boolean> {

    return this.apiService.post<ILoginRequest, ILoginResponse>('user-login', { userName: username, password: password }).pipe(
      take(1),
      map(users => {
        this.currentUser = users.data;
        this.dataService.updateData(this.currentUser);
        localStorage.setItem('token', JSON.stringify(users.data.token));
        return true;
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): ILoginResponse | null {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem('token');
    return stored ? JSON.parse(stored) : null;
  }

  // getUserRole(): string | null {
  //   return this.getCurrentUser()?.role ?? null;
  // }

  // isSuperAdmin(): boolean {
  //   return this.getCurrentUser()?.superAdmin ?? false;
  // }
}
