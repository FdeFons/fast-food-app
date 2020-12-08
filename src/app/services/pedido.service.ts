import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { pedidoI } from '../models/pedido.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  pedidosRef = this.db.collection("pedidos");
  ultPedido = [];
 
  constructor(private db:AngularFirestore) { }

  /* Añdadir un pedido */
  addPedidos(pedido:any){
     this.pedidosRef.add(pedido);
  }

  /*Utilizamos async para controlar la respuesta en el componente */
  async editarPedido(pedido: any){
    this.pedidosRef.doc(pedido.id).update({"pagado": true});
  }

  async terminarPedido(pedido: any){
    this.pedidosRef.doc(pedido.id).update({"terminado": true});
  }

  /* Obtener los pedidos */
  getAllPedidos(){
    return this.db
      .collection('pedidos' , ref => ref.orderBy('fecha',"desc"))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  /* Obtener ultimo pedido */
  getUltimoPedido(){
    this.db.collection("pedidos", ref => ref.orderBy("fecha", "desc").limit(1)).valueChanges().subscribe(res =>{
      this.ultPedido = res
    });;
  }


}
