
import { UserI } from 'src/app/models/user.interface';
import { LoginService } from './../../services/login/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { RoleValidator } from 'src/app/models/roleValidator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers:[LoginService]
})
export class HeaderComponent extends RoleValidator implements OnInit {
 
  public user$: Observable<UserI> = this.loginSvc.user$;

  constructor(private loginSvc: LoginService, private router: Router) {
    super();
   }

 async ngOnInit() {
    
  }

  async onLogout(){
    try {
      await this.loginSvc.logout(); // await pausa hasta que termina la instruccion
      //Al cerrar sesión nos redirige al login
      localStorage.clear();
      this.router.navigate(['login']);
    } catch (error) {
      console.log(error);
      
    }
  }

  isAdminn():Observable<boolean> | Promise<boolean> | boolean{
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
