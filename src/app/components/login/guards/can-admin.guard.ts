
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login/login.service';


@Injectable({
  providedIn: 'root'
})
export class CanAdminGuard implements CanActivate {

  constructor(private loginSvc:LoginService){}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginSvc.user$.pipe(
      take(1),
      map((user) => user && this.loginSvc.isAdmin(user)),
      tap((canAdmin) => {
        if (!canAdmin) {
          window.alert('Acceso denegado');
        }
      })
    );
  }
  
}
