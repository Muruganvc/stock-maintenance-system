import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MenuItem } from '../shared/models/IUser';
// import { MenuItem } from '../custom-sidenav/custom-sidenav.component';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [RouterModule, MatListModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() item: MenuItem

  nestedMenuItem = signal(false);

  toggleNested() {
    if (!this.item.subMenuItem) {
      return;
    }
    this.nestedMenuItem.set(!this.nestedMenuItem());
  }

}
