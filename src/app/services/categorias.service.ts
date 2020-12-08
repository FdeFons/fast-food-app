import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { categoriaI } from './../models/categoria.interface';
import { FileI } from './../models/file.interface';
import { delay, finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private filePath: any;
  private imageUrl: Observable<string>;
  

  constructor(private db:AngularFirestore, private storage:AngularFireStorage) {}

  /* Obtener las categorias */
  public getAllCategorias(){
    return this.db.collection('categorias' , ref => ref.orderBy('nombre',"asc")).snapshotChanges();
  }
     
  /* Añadir una categoría */ // no lo utilizo
  public async addCategorias(categoria:any){
     return await this.db.collection("categorias").add(categoria);
  }

  /* Actualizar una categoría */  
  async updateCategorias(categoria:any, newImage?:FileI){
   
      if(newImage){
       return this.uploadImage(categoria, newImage);
        
      }else{
        const cateEObj = {
          nombre: categoria.nombreE,
          imagen: categoria.imagen,
          fileRef: categoria.fileRef
        };
        return await this.db.collection("categorias").doc(categoria.id).update(cateEObj);
      }
  }
  /* Borrar una categoría */  
  public async deleteCategorias(id: any){
    return await this.db.collection("categorias").doc(id).delete();
  }

  public async preAddUpdateCategoria (categoria: categoriaI, image: FileI){
    return this.uploadImage(categoria, image);
  }

  /* Guardar categoria creada o editada */
  private saveCategoria(categoria: any){  
    if(categoria.id){
      const cateObj = {
        nombre: categoria.nombreE,
        imagen: this.imageUrl,
        fileRef: this.filePath
      };
      return this.db.collection("categorias").doc(categoria.id).update(cateObj);
    }
    else{
      const cateObj = {
        nombre: categoria.nombre,
        imagen: this.imageUrl,
        fileRef: this.filePath
      };
      return this.db.collection("categorias").add(cateObj);
    }

  }

  /* Añadir imagen al cloud firestore */
  private uploadImage(categoria: categoriaI, image: FileI ){
    this.filePath = `imagenes/categorias/${image.name}`; //backsticks o comillas inversas
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
    .pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe( urlImage =>{
          this.imageUrl = urlImage;
          this.saveCategoria(categoria);

        });
      })
    ).subscribe();
  }

  

}



// metodos de Javier


    /* getAll() {
      return this.db
        .collection('categorias')
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
 
    private  cargaCategorias() {
      this.getAll().subscribe(
        categorias =>{
          this.categorias = categorias;
          console.log('Categorias rt', categorias);
        }
      );
    } */

    // Metodos mios

    
     /*  public getAll() {
        return this.db.collection('categorias').snapshotChanges()
        .pipe(map( action => action
          .map(c => {
            const data = c.payload.doc.data() as categoriaI;
            const id = c.payload.doc.id;
            return { id, ...data };
          })));
      }

       public getAll():Observable<any[]> {
        return this.db.collection('categorias')
        .snapshotChanges()
        .pipe(
          map(actions=>
            actions.map(a => {
              const data = a.payload.doc.data() as categoriaI;
              const id = a.payload.doc.id;
              return {id, ...data};
            })
          )
        )
      }  */