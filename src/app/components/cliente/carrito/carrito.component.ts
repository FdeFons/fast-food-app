import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from 'src/app/services/pedido.service';
import { productsI } from './../../../models/products.interface';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import * as _ from 'lodash';
import * as moment from 'moment';
//import 'moment/locale/es-es';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  public carrito = [];
  private numPedido: number;
  public pago;

  public payPalConfig ? : IPayPalConfig;

  @ViewChild("carritoo", {static: false})carritoo;
  @ViewChild("metodoPago", {static: false})metodoPago;
  @ViewChild("modal_paypal", {static: false})modal_paypal;
  @ViewChild("pedidoRealizado", {static: false})pedidoRealizado;

  constructor(
    private modalService: NgbModal,
    private pedidoService: PedidoService) {
    
   }

  ngOnInit(): void {
    //this.getNum();
    this.pedidoService.getUltimoPedido()

    if(JSON.parse(localStorage.getItem('carrito'))){
      for(let i=0; i< JSON.parse(localStorage.getItem('carrito')).length; i++){
        this.carrito.push(JSON.parse(localStorage.getItem('carrito'))[i]);
      }
    //console.log(this.carrito);
    }

    /* PAYPAL */
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AXgs5eZkrOhdX6a9Ep_2Ana1IWXoL-JpDnDPERtIGbZ2vncjei6s3NeVgANnkauDFb27oiibCwHsRQUH',
      advanced: {
          commit: 'true'
      },
      style: { 
          label: 'paypal',
          layout: 'vertical'
      },
      
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
         // this.showCancel = true;

      },
      onError: err => {
          console.log('OnError', err);
       //   this.showError = true;
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
       //   this.resetStatus();
      },
    };
    

  }

  /* Fix numero decimales */
  dosDecimales(n) {
    let t=n.toString();
    let regex=/(\d*.\d{0,2})/;
    return t.match(regex)[0];
  }

  /* Botones aumentar o disminuir cantidad en el carrito */
  add1Producto(producto:productsI){
    producto.cantidad++;
    producto.precioPedido = producto.cantidad * producto.precio;
    
  }

  quit1Producto(producto:productsI){
    producto.cantidad--;
    producto.precioPedido = producto.cantidad * producto.precio;
    
    if(producto.cantidad==0){
      _.remove(this.carrito, p => _.isEqual(p,producto));
      if(this.carrito.length == 0){
        localStorage.clear();
      }
    }
  }

  /* Comprobar que tenemos productos en el carrito */
  carritolleno(){
    if(this.carrito.length){
       return true;
    }else{
      return false;
    }
  }

  /* Calculo del precio total del pedido */
  TotalPedido(){
    let total = 0;
    _.forEach(this.carrito, element => {
        total += element.precioPedido;
    });
    return total;
  }


  seguirComprando(){
    //comprobamos que el carro este lleno para guardar o no
    if(this.carrito.length != 0){
      localStorage.setItem('carrito', JSON.stringify(this.carrito));//guardamos los cambios del modal en el localstorage
    }
    this.modalService.dismissAll(this.carritoo);
     //Cerramos modal
  }


  metodoPagoo(pTotalPedido:number){
    if(this.carrito.length!=0){
      this.modalService.open(this.metodoPago , {size: 'xl', centered: true}).result.then(typePayment =>{
        /*  Pago paypal */
        if(typePayment === 'paypal'){
          this.pago = 'paypal';
          const items = []; // estos son los productos de nuestro pedido para que aparezcan en paypal

          _.forEach(this.carrito, producto =>{  // recorremos el carrito y obtenemos los datos para la previsualización en paypal
              items.push({
                  name: producto.nombre,
                  quantity: producto.cantidad,
                  unit_amount: {
                    currency_code: 'EUR',
                    value: this.dosDecimales(producto.precio),  
                  },
              })
          });
          /* console.log('itemss', items);
          console.log('totalpedido', pTotalPedido); */
          
          /* Creamos la orden en paypal */
          this.payPalConfig.createOrderOnClient = (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: this.dosDecimales(pTotalPedido),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: this.dosDecimales(pTotalPedido)
                        }
                    }
                },
                items : items
            }]
          }

          /* Si el pago ha tenido éxito guardamos el pedido en la base de datos */
          this.payPalConfig.onApprove = (data, actions) => {
            this.convertirPedido(pTotalPedido, this.pago);
          }
         
          this.modalService.open(this.modal_paypal, {size: 'xl', centered: true}).result;

        }
        /* Pago en efectivo */
        if(typePayment === 'cash'){
          this.pago = 'cash';
          this.convertirPedido(pTotalPedido, this.pago);
        }
      });
    }

    
    
  }


  /* Crear Modelo del pedido que guardamos en firebase */
  convertirPedido(pTotalPedido:number, pago:string){
    if(this.carrito.length!=0){
      this.numPedido = this.pedidoService.ultPedido[0].numPedido + 1; // el numero de pedido lo hemos cogido previamente al abrir el carrito
      // Creamos modelo del pedido final que guardaremos en firebase 
      const finalPedido = {
        "productos" : [],
        "fecha": moment().locale('es-es').format('DD-MM-YYYY, HH:mm:ss a'),
        "numPedido":  this.numPedido, 
        "terminado": false,
        "precioTotalPedido": pTotalPedido,
        "pagado": (pago == 'paypal')? true : false,
        "tipoPago": (pago == 'paypal')? 'Pago electrónico' : 'En efectivo' 
      }
      _.forEach(this.carrito, producto => {
        // Creamos modelo del producto final que añadiremos a los productos de "finalPedido" 
        const finalProducto= {
          "nombre": producto.nombre,
          "precioProducto": producto.precio,
          "precioFinal": producto.precioPedido,
          "cantidad": producto.cantidad
        }
        /* Metemos los productos en el pedido */
        finalPedido.productos.push(finalProducto);

      });
    
      this.pedidoService.addPedidos(finalPedido);          // Creamos el pedido en la base de datos 
      localStorage.clear();                                // vaciamos el local storage
      this.modalService.dismissAll(this.modal_paypal);     // cerramos los modales restantes 
      this.modalService.dismissAll(this.carritoo);

      this.modalService.open(this.pedidoRealizado , {centered: true})  // Aqui abrimos el modal correspondiente
    }
    
  }

  

}
