import { TableRow } from "../custom-table/custom-table.component";

export interface IProductTypeRequest {
    productName: string;
    companyId: number;
    categoryId: number;
    description?: string;
    mrp: number;
    salesPrice: number;
    taxType?: string;
    totalQuantity: number;
    barCode?: string;
    brandName?: string;
}

export interface IProductTypeResponse extends TableRow {
    companyId: number;
    companyName: string;
    categoryId: number;
    categoryName: string;
    productTypeId: number;
    productTypeName: string;
    description: string;
    mrp: number;
    salesPrice: number;
    taxPercent: number;
    totalQuantity: number;
    isActive: boolean;
    userName: string;
}