import { Injectable } from '@angular/core';
import { IProductCompanyResponse } from '../models/IProduct';
import { ApiService } from './api.service';
import { KeyValuePair } from '../models/IKeyValuePair';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private readonly api: ApiService) { }

  getProduct(companyId: number) {
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

}
