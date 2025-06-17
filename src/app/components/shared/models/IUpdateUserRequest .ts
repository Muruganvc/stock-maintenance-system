export interface IUpdateUserRequest {
    firstName: string;
    lastName: string;
    emailId: string;
    mobileNumber: string;
    isActive: boolean;
    isSuperAdmin: boolean;
}


export interface IChangePasswordRequest {
    userName: string;
    passwordHash: string;
    currentPassword: string;
    email: string;
}