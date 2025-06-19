import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../shared/custom-table/custom-table.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { IProductTypeResponse } from '../shared/models/IProductTypeRequest';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent,
    MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  constructor(private router: Router, private productService: ProductService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.getProducts();
  }

  products: IProductTypeResponse[] = [];

  getProducts() {
    this.productService.getProductTypes().subscribe({
      next: result => {
        this.products = result.data;
      }
    });

    if (true) {
      this.columns.push(
        { key: 'isActive', label: 'Active', align: 'right', type: 'checkbox', isHidden: true },
      );
    }

  }

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'companyName', label: 'Company', align: 'left', isHidden: false },
    { key: 'categoryName', label: 'Cat.Name', align: 'right', isHidden: false },
    { key: 'productTypeName', label: 'Prod.Name', align: 'right', isHidden: false },
    { key: 'description', label: 'Description', align: 'right', isHidden: false },
    { key: 'mrp', label: 'Mrp ₹', align: 'right', isHidden: false },
    { key: 'salesPrice', label: 'Mrp ₹', align: 'right', isHidden: false },
    { key: 'taxPercent', label: 'Tax %', align: 'right', isHidden: false },
    { key: 'totalQuantity', label: 'Total Quantity', align: 'right', isHidden: false },
    { key: 'userName', label: 'Creator', align: 'right', isHidden: false }
  ];

  onEdit(product: IProductTypeResponse) {
    this.router.navigate(['/new-product'], {
      state: { product }
    });
  }

  onDelete(product: IProductTypeResponse) {
    this.openConfirm(product['key']);
  }

  openConfirm(key: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  newOpen(a: any) {
    this.router.navigate(['/new-product']);
  }
}
