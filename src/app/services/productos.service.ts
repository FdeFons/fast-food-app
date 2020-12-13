import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FileI } from '../models/file.interface';
import { categoriaI } from './../models/categoria.interface';
import { productsI } from './../models/products.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  listProduct: Observable<any[]>;
  product: Observable<any[]>;

  productosRef = this.db.collection("productos", ref => ref.orderBy('nombre',"asc"));


  //imagenes
  private filePath: any;
  private imageUrl: Observable<string>;

  constructor(private db:AngularFirestore, private storage:AngularFireStorage) {}

   

  /* Listar todos los productos  */  
  getAllProductos(){
    return this.productosRef.snapshotChanges(); //el metodo nos envia los datos y nos mantiene suscritos al flujo de datos y cuando detecta un cambio en la base de datos no avisará y nos enviará los datos de nuevo
  }

  /* Obtener productos según la categoría */
  getAllProductosCat(id:any){
    this.listProduct =  this.db.collection("productos", ref => ref.where('id_categoria', "==", id)).valueChanges({ idField: 'idProducto' }); 
  }

  /* Obtener un producto en concreto  */
  getProducto(id: any){
    return  this.db.doc(`productos/${id}`).valueChanges(); 
  }

  /* Obtener productos según la novedad */
  getAllProductosNov(){
    this.listProduct = this.db.collection("productos", ref => ref.where('novedad', "==", true)).valueChanges({ idField: 'idProducto' });
  }
    
  /* Crear un nuevo producto */  
  addProductos(producto:any){
    return this.productosRef.add(producto);

  }
  /*   Actualizar un producto */  
  public async updateProductos(producto:any, newImage?:FileI){
      if(newImage){
        return this.uploadImage(producto, newImage);
      }else{
        const produEObj = {
          nombre: producto.nombreE,
          descripcion: producto.descripcionE,
          precio: producto.precioE,
          novedad: producto.novedadE,
          id_categoria: producto.id_categoriaE,
          imagen: producto.imagen,
          fileRef: producto.fileRef
        };
        return this.productosRef.doc(producto.id).update(produEObj);
      }
  }
  //subir producto con imagen
  public async preAddUpdateProducto (producto: productsI, image: FileI){
    return this.uploadImage(producto, image);
  }
  /*   Borrar un producto */  
  deleteProductos(id:any){
    return this.productosRef.doc(id).delete();
  }
    
  /*  Guardar Producto */
  private saveProducto(producto: any){
    if(producto.id){
      const produObj = {
        nombre: producto.nombreE,
        descripcion: producto.descripcionE,
        precio: producto.precioE,
        novedad: producto.novedadE,
        id_categoria: producto.id_categoriaE,
        imagen: this.imageUrl,
        fileRef: this.filePath
      };
      return this.productosRef.doc(producto.id).update(produObj);
    }
    else{
      const produObj = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        novedad: producto.novedad,
        id_categoria: producto.id_categoria,
        imagen: this.imageUrl,
        fileRef: this.filePath
      };
      return this.productosRef.add(produObj);
    }

  }

  /* Subir imagen a cloud firestore */
  private uploadImage(producto: productsI, image: FileI ){
    this.filePath = `imagenes/productos/${image.name}`; //backsticks o comillas inversas
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
    .pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe( urlImage =>{
          this.imageUrl = urlImage;
          this.saveProducto(producto);
        });
      })
    ).subscribe();
  }
  
  

}



