import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, map, switchMap, take } from 'rxjs';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { ILoginRequest, ILoginResponse, MenuItem } from '../models/IUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: ILoginResponse;
  private allowedRoutes = new Set<string>();
  readonly menuItems = signal<MenuItem[]>([]);

  private channel = new BroadcastChannel('auth-channel'); // 🔁 Sync across tabs

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dataService: DataService
  ) {
    this.listenToAuthEvents();
  }

  login(username: string, password: string): Observable<boolean> {
    const payload: ILoginRequest = { userName: username, password };

    return this.apiService.post<ILoginRequest, ILoginResponse>('user-login', payload).pipe(
      take(1),
      switchMap(userResponse => {
        this.setSession(userResponse.data);

        return this.loadUserPermissions();
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
    this.channel.postMessage({ type: 'logout' }); // 🔁 Notify other tabs
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loginUser');
  }

  getCurrentUser(): ILoginResponse | null {
    if (this.currentUser) return this.currentUser;

    const stored = localStorage.getItem('loginUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    this.dataService.updateCurrentUser(this.currentUser);
    return this.currentUser;
  } 

  hasAccess(path: string): boolean {
    const route = path.replace(/^\//, '').toLowerCase();
    return this.allowedRoutes.has(route);
  }

  getMenuRoutes(): string[] {
    return Array.from(this.allowedRoutes);
  }

  loadUserPermissions(): Observable<boolean> {
    const user = this.getCurrentUser();
    if (!user) return of(false);

    return this.apiService.get<MenuItem[]>(`menus/${user.userId}`).pipe(
      map(response => {
        const menus = response.data;
        this.menuItems.set(menus);
        this.allowedRoutes = new Set(extractRoutesFromMenu(menus));
        this.dataService.updateData(menus);
        return true;
      })
    );
  }


getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --------------------
  // 🔧 Private Utilities
  // --------------------

  private setSession(user: ILoginResponse): void {
    this.currentUser = user;
    localStorage.setItem('loginUser', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    this.dataService.updateCurrentUser(user);
  }

  private clearSession(): void {
    this.allowedRoutes.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('loginUser');
  }

  private listenToAuthEvents(): void {
    this.channel.onmessage = (event) => {
      if (event.data?.type === 'logout') {
        this.clearSession();
        this.router.navigate(['/login']);
      }
    };
  }
}

// --------------------
// 📦 Menu Route Extractor
// --------------------

// function extractRoutesFromMenu(menuItems: MenuItem[]): string[] {
//   const routes: string[] = [];

//   const collect = (items: MenuItem[]) => {
//     for (const item of items) {
//       if (item.route) routes.push(item.route);
//       if (item.subMenuItem?.length) collect(item.subMenuItem);
//     }
//   };

//   collect(menuItems);
//   return routes;
// }

function extractRoutesFromMenu(menuItems: MenuItem[]): string[] {
  const routes: string[] = [];

  const collect = (items: MenuItem[], basePath = '') => {
    for (const item of items) {
      const currentPath = item.route?.trim() ?? '';
      const fullPath = basePath ? `${basePath}/${currentPath}` : currentPath;

      if (currentPath) {
        routes.push(fullPath.toLowerCase());
      }

      if (item.subMenuItem?.length) {
        collect(item.subMenuItem, fullPath);
      }
    }
  };

  collect(menuItems);
  return routes;
}
