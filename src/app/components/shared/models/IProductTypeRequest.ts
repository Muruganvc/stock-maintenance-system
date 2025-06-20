import { TableRow } from "../custom-table/custom-table.component";

export interface IProductRequest {
    productName: string;
    companyId: number;
    categoryId: number;
    productCategoryId?: number;
    description?: string;
    mrp: number;
    salesPrice: number;
    taxType?: string;
    totalQuantity: number;
    barCode?: string;
    brandName?: string;
    taxPercent?: number;
}

 
export interface IGetProductsQueryResponse extends TableRow {
  productId: number;
  productName: string;
  productCategoryId?: number;
  productCategoryName?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  companyId?: number | null;
  companyName?: string | null;
  description?: string | null;
  mrp: number;
  salesPrice: number;
  quantity: number;
  taxPercent: number;
  taxType?: string | null;
  barcode?: string | null;
  brandName?: string | null;
  isActive: boolean;
  userName?: string | null;
}

export interface IUpdateProductRequest {
  productId: number;
  productName: string;
  companyId: number;
  categoryId: number;
  productCategoryId?: number | null;
  description?: string | null;
  mrp: number;
  salesPrice: number;
  totalQuantity: number;
  isActive: boolean;
  taxType?: string | null;       // default "GST"
  barCode?: string | null;       // default null
  brandName?: string | null;     // default null
  taxPercent?: number;           // default 18
}
