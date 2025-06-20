import { Injectable } from '@angular/core';
import { IProductCompanyResponse } from '../models/IProduct';
import { ApiService } from './api.service';
import { KeyValuePair } from '../models/IKeyValuePair';
import { IGetProductsQueryResponse, IProductRequest, IUpdateProductRequest } from '../models/IProductTypeRequest';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private readonly api: ApiService) { }

  getProduct12(companyId: number) {
    return this.api.get<IProductCompanyResponse[]>(`product-company?companyId=${companyId}`);
  }

  getCompany(companyName?: string) {
    const url = companyName
      ? `companyName=${encodeURIComponent(companyName)}`
      : `company`;

    return this.api.get<KeyValuePair[]>(url);
  }
  getCategories(companyId: number) {
    return this.api.get<KeyValuePair[]>(`category/${companyId}`);
  }
  getProductCategories(categoryId: number) {
    return this.api.get<KeyValuePair[]>(`product-category/${categoryId}`);
  }
  createProduct(product: IProductRequest) {
    return this.api.post<IProductRequest, number>('product', product);
  }

  getProductTypes() {
    return this.api.get<IGetProductsQueryResponse[]>('products');
  }
  updateProduct(productId: number, product: IUpdateProductRequest) {
    return this.api.put<IUpdateProductRequest, number>(`product/${productId}`, product);
  }
  activatProduct(productId: number) {
    return this.api.put<{}, number>(`product/activate/${productId}`, {});
  }
}
