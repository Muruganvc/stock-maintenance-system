import { TableRow } from "../custom-table/custom-table.component";

export interface IProduct extends TableRow {
    productId?: string;
    productName: string;
    company: string;
    itemFullName: string;
    model: string;
    maximumRetailPrice: number;
    salesPrice: number;
    length: string;
    quantity: number;
    totalQuantity: number;
    purchaseDate?: Date;
    isWarranty: boolean;
}