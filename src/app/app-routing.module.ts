import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { CanAdminGuard } from './components/login/guards/can-admin.guard';
import { CanClienteGuard } from './components/login/guards/can-cliente.guard';
import { CanEmpleadoGuard } from './components/login/guards/can-empleado.guard';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch:'full'},
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },

  { path: 'admin', loadChildren: () => 
    import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [CanAdminGuard]
  },

  { path: 'cliente', loadChildren: () => 
    import('./components/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [CanClienteGuard]
  },
  
  { path: '**', component: NotFoundComponent }

  /* { path: 'product/:id', component: productComponent} */
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
