import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { UserI } from 'src/app/models/user.interface';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { RoleValidator } from 'src/app/models/roleValidator';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends RoleValidator {
  public user$:Observable<UserI>;
  public rol: string;
  public token: any;
  public refreshToken: any;
 
  constructor(public afAuth: AngularFireAuth , private db: AngularFirestore) { 
    super();
    this.user$ = this.afAuth.authState.pipe(  //Esto recupera el usuario logado
      switchMap((user) => {           //switch map si esta en medio de un proceso y pasara algo en el authState, lo cancela e inicia uno nuevo.
        if(user){
          return this.db.doc<UserI>(`users/${user.uid}`).valueChanges(); //recuperamos documento del usuario
        }
        return of(null);
      })
    )

    
  }


//metodo de login
  /* async login(email: string, password: string){
      const result = await this.afAuth.signInWithEmailAndPassword(email , password);
      this.token = await result.user.getIdToken();   //con esto vemos el token de acceso creado
      console.log('Token = ', this.token);
      console.log('id', result.user.uid);   // ver UID del usuario
      console.log('user ', result.user);
      return result;
  } */

  async login(email: string, password: string): Promise<UserI>{
      const {user} = await this.afAuth.signInWithEmailAndPassword(email , password);  //destructuring del objeto de usuario {user}
      this.token = await user.getIdToken();
      this.refreshToken = await user.getIdTokenResult();
         //con esto vemos el token de acceso creado
      console.log('Token = ', this.token);
      console.log('id', user.uid);   // ver UID del usuario
      console.log('user ', user);
      console.log('Refresh Token = ', user.refreshToken);
      
      //this.updateUser(user);
      return user;
  }


// metodo de cerrar sesion
  async logout(){
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log(error);
    }
    // redirigir al usuario al home
    //En caso de tener alguna información en el localstorage referente al usuario vaciarla
  }
// metodo registrarse
  async register(email: string, password: string){
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email , password);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
// metodo para coger el usuario actualmente logeado
  // getCurrentUser(){
  //   return this.afAuth.authState.pipe(first()).toPromise();
  // }

  private updateUser(user:UserI){
    const userRef : AngularFirestoreDocument<UserI> = this.db.doc(`users/${user.uid}`);
    const data:UserI = {
      uid: user.uid,
      email: user.email,
      role: 'ADMIN'
    }
    return userRef.set(data ,{merge: true});
  }

}
