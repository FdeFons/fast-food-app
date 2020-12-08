import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.component.html',
  styleUrls: ['./list-categorias.component.css']
})
export class ListCategoriasComponent implements OnInit {
  categorias = [] ;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService) { }

  ngOnInit(): void {

    this.recuperarCategorias();

  }

  /* Obtenemos todas las categorias */
  recuperarCategorias(){
    this.categoriasService.getAllCategorias().subscribe(res => {
      this.categorias =  res.map((c: any) => {
        return{
          id: c.payload.doc.id,
          nombre: c.payload.doc.data().nombre,
          imagen: c.payload.doc.data().imagen,
          fileRef: c.payload.doc.data().fileRef
        }
      })
    },
      error=>{
        console.log(error);
    }
    );
  }

  /* Obtenemos todos los productos de una categoria */
  cargarProductos(id:any){
    this.productosService.getAllProductosCat(id);
  }

}
