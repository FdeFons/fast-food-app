import { CategoriasComponent } from './categorias/categorias.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';
import { PedidosComponent } from './pedidos/pedidos.component';

import { AdminComponent } from './admin.component';



const routes: Routes = [
  { path: '', redirectTo: 'producto', pathMatch: 'full' },
  { path: 'producto', component: ProductoComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'pedidos', component: PedidosComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
