import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../shared/custom-table/custom-table.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { IProduct } from '../shared/models/IProduct';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

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

  products: IProduct[] = [];

  getProducts() {
    // this.productService.getAll().snapshotChanges().subscribe(actions => {
    //   this.products = actions.map(action => {
    //     const data = action.payload.val() as IProduct;
    //     const key = action.key;
    //     return { key, ...data };
    //   });
    // });
  } 

  columns: { key: string; label: string; align: 'left' | 'center' | 'right' }[] = [
    { key: 'productName', label: 'Product Name', align: 'left' },
    { key: 'company', label: 'Company', align: 'right' },
    { key: 'itemFullName', label: 'Item Name', align: 'right' },
    { key: 'model', label: 'Model', align: 'right' },
    { key: 'maximumRetailPrice', label: 'Mrp ₹', align: 'right' },
    { key: 'salesPrice', label: 'Sales Price ₹', align: 'right' },
    { key: 'length', label: 'Length (m)', align: 'right' },
    { key: 'quantity', label: 'Quty', align: 'right' },
    { key: 'totalQuantity', label: 'Total Stock', align: 'right' },
    { key: 'purchaseDate', label: 'Purchase Date', align: 'right' },
    { key: 'warranty', label: 'Warranty', align: 'right' }
  ];

  onEdit(product: IProduct) {
    this.router.navigate(['/new-product'], {
      state: { product }
    });
  }

  onDelete(product: IProduct) {
    // this.products = this.products.filter(u => u.id !== user.id);
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
        // this.productService.delete(key);
      }
    });
  }

  newOpen(a: any) {
    this.router.navigate(['/new-product']);
  }
}
