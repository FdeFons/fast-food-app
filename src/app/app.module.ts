//Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

//Componentes
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { CarritoComponent } from './components/cliente/carrito/carrito.component';

//Modules
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPayPalModule } from 'ngx-paypal';

//Guards
import { CanClienteGuard } from './components/login/guards/can-cliente.guard';
import { CanAdminGuard } from './components/login/guards/can-admin.guard';
import { CanEmpleadoGuard } from './components/login/guards/can-empleado.guard';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, BUCKET} from '@angular/fire/storage';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
    CarritoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModule,
    NgxPayPalModule
  ],
  providers: [
    {provide: BUCKET, useValue:'gs://fast-food-01.appspot.com'},
    CanAdminGuard,
    CanClienteGuard,
    CanEmpleadoGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
