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

export interface ILoginRequest {
    userName: string;
    password: string;
}

export interface ILoginResponse {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    token: string;
}



export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subMenuItem?: MenuItem[];
};