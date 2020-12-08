import { LoginService } from '../../../services/login/login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CanClienteGuard implements CanActivate {

  constructor(private loginSvc:LoginService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
    return this.loginSvc.user$.pipe(
      take(1),
      map((user) => user && this.loginSvc.isCliente(user) ),  /* || this.loginSvc.isAdmin(user)*/      
      tap( canClient =>{
        if(!canClient){
          window.alert('Acceso denegado, no eres cliente');
        }
      })
    )
  }
  
}
