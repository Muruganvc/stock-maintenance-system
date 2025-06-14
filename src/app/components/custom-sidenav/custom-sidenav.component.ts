import { Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from "../menu-item/menu-item.component";
export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subMenuItem?: MenuItem[];
};

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [MatListModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {

  readonly menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: 'setting',
      subMenuItem: [
        {
          icon: 'person',
          label: 'Add new user',
          route: 'add-user'
        },
        {
          icon: 'add_shopping_cart',
          label: 'Password change',
          route: 'change-password'
        },
        {
          icon: 'person',
          label: 'User Permission',
          route: 'user-permission'
        },
      ]
    },
    {
      icon: 'add_shopping_cart',
      label: 'Product',
      route: 'product-list'
    },
    {
      icon: 'remove_shopping_cart',
      label: 'Sales',
      route: 'sales'
    },
  ]);

}
