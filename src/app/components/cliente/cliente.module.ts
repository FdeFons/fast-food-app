import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteComponent } from './cliente.component';
import { ListCategoriasComponent } from './list-categorias/list-categorias.component';
import { ListProductosComponent } from './list-productos/list-productos.component';
import { ProductoComponent } from './producto/producto.component';




@NgModule({
  declarations: [
    ClienteComponent, 
    ListCategoriasComponent, 
    ListProductosComponent, ProductoComponent],
  imports: [
    CommonModule,
    ClienteRoutingModule
  ]
})
export class ClienteModule { }
