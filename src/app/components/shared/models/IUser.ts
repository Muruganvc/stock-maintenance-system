import { TableRow } from "../custom-table/custom-table.component";

export interface IUser extends TableRow {
    userId?: string;
    firstName: string;
    lastName: string;
    userName: string;
    emailId: string;
    mobileNumber: string;
    password: string;
    role: string;
    isActive: boolean
    superAdmin: boolean;
}