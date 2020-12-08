export type RolesI = 'ADMIN' | 'EMPLEADO' | 'CLIENTE';

export interface UserI {
    uid: string;
    email: string;
    displayname?: string;
    emailVerified?: boolean;
    password?: string;
    role?: RolesI;
    
}