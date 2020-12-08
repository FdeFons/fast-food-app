import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { productsI } from './../../../models/products.interface';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router'
import { ProductosService } from 'src/app/services/productos.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  //public idProducto:string;
  public producto$ : Observable<any>;  
  public carrito = [];
  public idProducto;

  @ViewChild("addProducto", {static: false})addProducto;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private productosService: ProductosService,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {

    this.idProducto = this.route.snapshot.params.id;  // recuperamos el id de la url
    this.producto$ = this.productosService.getProducto(this.idProducto);

    if(!this.producto$){
      this.router.navigate(['/cliente//list-categorias']);
    }  
    
  }

  volver(){
    this.router.navigate(['/cliente//list-productos']);
  }

  addProductoPedido(producto: productsI){
    producto.id = this.idProducto;
    if(localStorage.getItem('carrito')){
      let carrito = [];
      for(let i=0; i< JSON.parse(localStorage.getItem('carrito')).length; i++){
         carrito.push(JSON.parse(localStorage.getItem('carrito'))[i]);
      }
      //buscamos el producto para ver si existe
      if(carrito.find(e => e.id === producto.id)){
        if(carrito.find(e => e.id ===producto.id).cantidad==null){
          carrito.find(e => e.id ===producto.id).cantidad = 1;
          carrito.find(e => e.id ===producto.id).precioPedido = carrito.find(e => e.id ===producto.id).precio;
        }else{
          carrito.find(e => e.id ===producto.id).cantidad++;
          carrito.find(e => e.id ===producto.id).precioPedido = carrito.find(e => e.id ===producto.id).precio * carrito.find(e => e.id ===producto.id).cantidad;
        }
      }
       else{
        producto.cantidad = 1;
        producto.precioPedido = producto.precio;
        carrito.push(producto);
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));

    }else{
      producto.cantidad = 1;
      producto.precioPedido = producto.precio;
      this.carrito.push(producto);
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
    
    this.modalService.open(this.addProducto, {ariaLabelledBy: 'modal-basic-title', centered: true});
    this.router.navigate(['/cliente//list-categorias']);
  }

}
