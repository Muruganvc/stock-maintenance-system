import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PasswordChangeComponent } from './components/settings/password-change/password-change.component';
import { NewUserComponent } from './components/settings/new-user/new-user.component';
import { UserPermissionComponent } from './components/settings/user-permission/user-permission.component';
import { NewProductComponent } from './components/product-list/new-product/new-product.component';
import { UserListComponent } from './components/settings/new-user/user-list/user-list.component';
import { authGuard } from './components/shared/services/auth.guard';
import { SalesComponent } from './components/sales/sales.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product-list', component: ProductListComponent },
      { path: 'new-product', component: NewProductComponent },
      { path: 'sales', component: SalesComponent },
      {
        path: 'setting',
        component: SettingsComponent,
        children: [
          // 👇 Default route for /setting
          { path: '', redirectTo: 'change-password', pathMatch: 'full' },

          { path: 'change-password', component: PasswordChangeComponent },
          { path: 'user-permission', component: UserPermissionComponent },
          { path: 'user-list', component: UserListComponent },
          { path: 'add-user', component: NewUserComponent }
        ]
      }
    ]
  },
  { path: 'access-denied', component: AccessDeniedComponent },
   { path: '**', redirectTo: 'access-denied' }
];

