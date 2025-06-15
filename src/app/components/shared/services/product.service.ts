import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { IProduct } from '../models/IProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly dbPath = '/product';
  private readonly productRef: AngularFireList<IProduct>;

  constructor(private db: AngularFireDatabase) {
    this.productRef = this.db.list<IProduct>(this.dbPath);
  }

  getAll(): AngularFireList<IProduct> {
    return this.productRef;
  }

  getById(id: string): AngularFireObject<IProduct> {
    return this.db.object<IProduct>(`${this.dbPath}/${id}`);
  }

  create(product: IProduct): Promise<void> {
    const newRef = this.productRef.push({
      id: '',
      productName: product.productName,
      company: product.company,
      itemFullName: `${product.productName} ${product.company}`,
      model: product.model,
      maximumRetailPrice: product.maximumRetailPrice,
      salesPrice: product.salesPrice,
      length: product.length,
      quantity: product.quantity,
      totalQuantity: product.totalQuantity,
      purchaseDate: product.purchaseDate,
      isWarranty: product.isWarranty
    });
    return newRef.set({ ...product });
  }

  update(id: string, product: Partial<IProduct>): Promise<void> {
    return this.productRef.update(id, product);
  }

  delete(id: string): Promise<void> {
    return this.productRef.remove(id);
  }
}
