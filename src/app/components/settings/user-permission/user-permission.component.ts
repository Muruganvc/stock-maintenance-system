import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../shared/models/IUser';
import { UserService } from '../../shared/services/user.service';
import {MatFormFieldModule} from '@angular/material/form-field';
@Component({
  selector: 'app-user-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatFormFieldModule,MatCheckboxModule, MatIconModule],
  templateUrl: './user-permission.component.html',
  styleUrl: './user-permission.component.scss'
})
export class UserPermissionComponent implements OnInit {

  constructor(private readonly userService: UserService) { }
  screenHeight: number = window.innerHeight;

  flatMenu: any[] = [];
  displayedColumns: string[] = ['label', 'route', 'icon', 'level'];

  ngOnInit(): void {
    const userId = 1;
    this.userService.getAllMenu().subscribe({
      next: (menu: MenuItem[]) => {
        this.flatMenu = [];
        this.flattenMenu(menu);
      },
      error: (err) => {
        console.error('Failed to load menu:', err);
      }
    });
    
    this.updateHeight();
  }

  @HostListener('window:resize')
  updateHeight(): void {
    this.screenHeight = window.innerHeight;
  }
  flattenMenu(menuItems: MenuItem[], level: number = 0): void {
    for (let item of menuItems) {
      this.flatMenu.push({ ...item, level });
      if (item.subMenuItem?.length) {
        this.flattenMenu(item.subMenuItem, level + 1);
      }
    }
  }
}
