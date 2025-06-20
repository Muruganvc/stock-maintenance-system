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
import { IGetProductsQueryResponse } from '../shared/models/IProductTypeRequest';
import { DataService } from '../shared/services/data.service';

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
  constructor(private router: Router, private productService: ProductService, private dialog: MatDialog, private readonly dataService: DataService) { }
  ngOnInit(): void {
    this.getProducts();
  }

  products: IGetProductsQueryResponse[] = [];

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
    // { key: 'companyName', label: 'Company', align: 'left', isHidden: false },
    // { key: 'categoryName', label: 'Cat.Name', align: 'right', isHidden: false },
    { key: 'productName', label: 'Prod.Name', align: 'left', isHidden: false },
    { key: 'description', label: 'Description', align: 'left', isHidden: false },
    { key: 'mrp', label: 'Mrp ₹', align: 'left', isHidden: false },
    { key: 'salesPrice', label: 'Mrp ₹', align: 'left', isHidden: false },
    { key: 'taxPercent', label: 'Tax %', align: 'left', isHidden: false },
    { key: 'quantity', label: 'Total Quantity', align: 'left', isHidden: false },
    { key: 'userName', label: 'Creator', align: 'left', isHidden: false }
  ];

  onEdit(product: IGetProductsQueryResponse) {
    this.router.navigate(['/new-product'], {
      state: { product }
    });
  }

  handleFieldChange(event: { row: IGetProductsQueryResponse; key: string; value: any }) {
    this.productService.activatProduct(event.row.productId ?? 0).subscribe({
      next: result => {
        if (result) {
          // this.getProducts();
        }
      }
    })
  }

  onDelete(product: IGetProductsQueryResponse) {
    alert('Not yet Implemented.'); return;
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
