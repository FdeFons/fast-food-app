import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { LoginService } from './../../services/login/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  private isValidEmail = /\S+@\S+\.\S+/;
  public errorMessage: string;
  public classs: string;
  public userRol: string = '';

  loginForm= new FormGroup({
    //email: new FormControl('', [Validators.required ,Validators.pattern(this.isValidEmail)]),
    email: new FormControl('', [Validators.required ,Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  constructor(private loginSvc:LoginService, private router: Router) {
    this.classs = '';
   }
 
  ngOnInit(): void {}

  async onLogin(){
    if(this.loginForm.valid){
      const {email, password} = this.loginForm.value
      try {
        const user = await this.loginSvc.login(email, password);  // nos logueamos y obtenemos el udsuario registrado
        //comprobar rol

        if(user){
          this.loginSvc.user$.subscribe(res =>{
            this.userRol = res.role;
            if(user && this.userRol=='ADMIN'){
              this.router.navigate(['admin']);
            }
            if(user && this.userRol=='CLIENTE'){
              this.router.navigate(['cliente']);
            }

          })
        }
      } catch (error) {
        /* Validaciones */
        if(error.code == 'auth/wrong-password' || error.code == 'auth/user-not-found'){
          this.errorMessage='Usuario y contraseña no coinciden.';
          this.loginForm.controls['email'].setErrors({invalid: true});
          this.loginForm.controls['password'].setErrors({invalid: true});
          this.classs='is-invalid';
        }
      }

    } else {
      this.classs='is-invalid';
      this.errorMessage='Email y contraseña no válidos.';
    }


   }


  get email(){ return this.loginForm.get('email'); }
  get message(){ return this.loginForm.get('message'); }
  get password(){ return this.loginForm.get('password'); }


}
