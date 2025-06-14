import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../shared/custom-table/custom-table.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  users: any[] = [
    { id: 1, name: 'Murugan', email: 'murugan@example.com' },
    { id: 2, name: 'Anitha', email: 'anitha@example.com' },
     { id: 1, name: 'Murugan', email: 'murugan@example.com' },
    { id: 2, name: 'Anitha', email: 'anitha@example.com' },
     { id: 1, name: 'Murugan', email: 'murugan@example.com' },
    { id: 2, name: 'Anitha', email: 'anitha@example.com' },
  ];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right' }[] = [
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'email', label: 'Email', align: 'right' }

  ];

  onEdit(user: any) {
    console.log('Edited:', user);
  }

  onDelete(user: any) {
    this.users = this.users.filter(u => u.id !== user.id);
  }
}
