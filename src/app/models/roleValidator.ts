import { UserI } from './user.interface';

export class RoleValidator {
    isCliente(user:UserI):boolean{
        return user.role == 'CLIENTE';
    }
    
    isEmpleado(user:UserI):boolean{
        return user.role == 'EMPLEADO';
    }
    
    isAdmin(user: UserI): boolean {
        return user.role == 'ADMIN';
      }

}