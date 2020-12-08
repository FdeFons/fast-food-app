import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProductoComponent } from './producto/producto.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { PedidosComponent } from './pedidos/pedidos.component';


@NgModule({
  declarations: [
    ProductoComponent, 
    CategoriasComponent, 
    PedidosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminModule { }
