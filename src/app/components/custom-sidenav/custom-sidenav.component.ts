import { Component, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { DataService } from '../shared/services/data.service';
import { UserService } from '../shared/services/user.service';
import { MenuItem } from '../shared/models/IUser';
// export type MenuItem = {
//   icon: string;
//   label: string;
//   route?: string;
//   subMenuItem?: MenuItem[];
// };

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [MatListModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent implements OnInit {
  userId: number = 0;
  fullName : string;
  readonly menuItems = signal<MenuItem[]>([]);
  constructor(private readonly dataService: DataService, private readonly userService: UserService) { }

  ngOnInit(): void {
    this.dataService.currentData$.subscribe(result => {
      // this.userId = result.userId
       this.menuItems.set(result)
    });


    this.dataService.currentUser$.subscribe({
      next : result =>{
          this.fullName = `${result?.firstName} ${result?.lastName}`
      }
    })

    if (this.userId > 0) {
      // this.getMenus();
    }
  }

  getMenus() {
    this.userService.getUserMenu(this.userId).subscribe({
      next: (items) => this.menuItems.set(items),
      error: (err) => console.error('Failed to load menu', err)
    });
  }


  // readonly menuItems = signal<MenuItem[]>([
  //   {
  //     icon: 'dashboard',
  //     label: 'Dashboard',
  //     route: 'dashboard'
  //   },
  //   {
  //     icon: 'settings',
  //     label: 'Settings',
  //     route: 'setting',
  //     subMenuItem: [
  //       {
  //         icon: 'person',
  //         label: 'Add new user',
  //         route: 'user-list'
  //       },
  //       {
  //         icon: 'add_shopping_cart',
  //         label: 'Password change',
  //         route: 'change-password'
  //       },
  //       {
  //         icon: 'person',
  //         label: 'User Permission',
  //         route: 'user-permission'
  //       },
  //     ]
  //   },
  //   {
  //     icon: 'add_shopping_cart',
  //     label: 'Product',
  //     route: 'product-list'
  //   },
  //   {
  //     icon: 'remove_shopping_cart',
  //     label: 'Sales',
  //     route: 'sales'
  //   },
  // ]);

}
