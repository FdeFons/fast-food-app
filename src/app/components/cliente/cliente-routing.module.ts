import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ListCategoriasComponent } from './list-categorias/list-categorias.component';
import { ListProductosComponent } from './list-productos/list-productos.component';
import { ProductoComponent } from './producto/producto.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-categorias', pathMatch: 'full' },
  { path: 'list-categorias', component: ListCategoriasComponent },
  { path: 'list-productos', component: ListProductosComponent },
  { path: 'list-productos/producto/:id', component: ProductoComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
