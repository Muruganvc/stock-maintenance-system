import { Injectable } from '@angular/core';
import { IUser } from '../models/IUser';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: IUser | null = null;
  constructor(private userService: UserService, private router: Router) { }
  login(username: string, password: string): Observable<boolean> {
    return this.userService.getByUserName(username).valueChanges().pipe(
      take(1),
      map(users => {
        if (users.length === 0) return false;
        const user = users[0];
        if (user.password !== password) return false;

        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      })
    );
  }
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): IUser | null {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  getUserRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  isSuperAdmin(): boolean {
    return this.getCurrentUser()?.superAdmin ?? false;
  }
}
