import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { productsI } from './../../../models/products.interface';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-list-productos',
  templateUrl: './list-productos.component.html',
  styleUrls: ['./list-productos.component.css']
})
export class ListProductosComponent implements OnInit {

  listProductos$: Observable<productsI[]>;
  
  constructor(private router: Router, private productosService: ProductosService) { }

  ngOnInit(): void {

    this.listProductos$ = this.productosService.listProduct

    if(!this.listProductos$){
      this.router.navigate(['/cliente/list-categorias']);
    } 

  }


}
