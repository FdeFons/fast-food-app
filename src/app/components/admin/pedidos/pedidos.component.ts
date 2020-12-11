import { pedidoI } from './../../../models/pedido.interface';
import { Component, OnInit, ViewChild } from '@angular/core';

import { PedidoService } from 'src/app/services/pedido.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: pedidoI[] = [];
  productosPedido = [];
  
  closeResult = '';
  config: any;

  

  constructor(private pedidoService:PedidoService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: this.pedidos.length
    };

    this.cargaPedidos();
    
  }

  pageChanged(event){
    this.config.currentPage = event;
  }


  cargaPedidos() {
    this.pedidoService.getAllPedidos().subscribe(
      pedidos =>{
        this.pedidos = pedidos;
        console.log('Pedidos', pedidos);
      }
    );
  }

  pagarPedido(pedido: pedidoI){
    this.pedidoService.editarPedido(pedido).then(res=>{
      this.cargaPedidos();
    });
  }

  terminarPedido(pedido: pedidoI){
    if(pedido.pagado){
      this.pedidoService.terminarPedido(pedido).then(res=>{
        this.cargaPedidos();
      });
    }

  }


  /* Modal Pedido */
  open(verPedidoo, pedido) {
    this.productosPedido = pedido;

    this.modalService.open(verPedidoo, {ariaLabelledBy: 'modal-basic-title',centered: true, size: 'xl',}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
