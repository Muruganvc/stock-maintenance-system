import { TableRow } from "../custom-table/custom-table.component";

export interface IUserList extends TableRow {
    userId: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    superAdmin: boolean;
    lastLogin: Date;
}
