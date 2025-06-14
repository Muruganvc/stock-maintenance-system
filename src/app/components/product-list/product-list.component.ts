import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../shared/custom-table/custom-table.component";
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
}
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  userData = [
    { id: 1, name: 'Alice', email: 'alice@example.comdsfffffffffffffffffffffff', },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];

  userColumns = [
    { key: 'id', label: 'ID', editable: false, align: 'left', sortable: true },
    { key: 'name', label: 'Name', editable: true, align: 'left', sortable: true },
    { key: 'email', label: 'Email', editable: true, align: 'left', sortable: true },
    { key: 'status', label: 'Status', editable: true, align: 'right', sortable: true },
  ];

  onEdit(row: any) {
    console.log('Edit clicked:', row);
  }

  onDelete(row: any) {
    console.log('Delete clicked:', row);
  }
}
