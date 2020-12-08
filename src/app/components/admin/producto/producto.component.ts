import { Component, OnInit } from '@angular/core';
import { CategoriasService } from './../../../services/categorias.service';
import { ProductosService } from '../../../services/productos.service';
import { productsI } from '../../../models/products.interface';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';





@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
    public errorMessage: string;
    closeResult = '';
    config: any;
    private image: any;
    productos = [] ;
    categorias = [] ;
    produForm: FormGroup;
    //public productos$: Observable<producto[]>;

    //Validaciones
    imagenValid = /(.jpg|.jpeg|.png|.gif)$/i;
    classNombre = '';
    classDescripcion = '';
    classPrecio = '';
    classImagenPro = '';
    classNovedad = '';
    classId_Categoria = '';

    //Validaciones Editar
    classNombreE = '';
    classDescripcionE = '';
    classPrecioE = '';
    classImagenProE = '';
    classNovedadE = '';
    classId_CategoriaE = '';

    //para editar producto
    private imageOriginal: any;
    produFormEdit: FormGroup;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // configuracion de la paginación
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.productos.length
    };

    this.produFormEdit = this.fb.group({
      id: new FormControl('', Validators.required),
      nombreE: new FormControl('', Validators.required),
      descripcionE: new FormControl('', [Validators.required, Validators.minLength(8)]),
      precioE: new FormControl('', Validators.required),
      novedadE: new FormControl('', Validators.required),
      id_categoriaE: new FormControl('', Validators.required),
      imagenProE: new FormControl('', Validators.pattern(this.imagenValid)),
      fileRef: new FormControl('', Validators.required),
    })

    this.produForm = this.fb.group({
      nombre: new FormControl('',[Validators.required, Validators.minLength(4)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(8)]),
      precio: new FormControl('', Validators.required),
      novedad: new FormControl('', Validators.required),
      id_categoria: new FormControl('', Validators.required),
      imagenPro: new FormControl('', [Validators.required ,Validators.pattern(this.imagenValid)]),
    })

    this.recuperarCategorias();
    this.recuperarProducts();
       
  
  }

  pageChanged(event){
    this.config.currentPage = event;

  }

  /* Obtener datos de productos */
  recuperarProducts(){
    this.productosService.getAllProductos().subscribe(res => {
      this.productos = res.map((p:any) =>{
        return{
          id: p.payload.doc.id,
          nombre: p.payload.doc.data().nombre,
          precio: p.payload.doc.data().precio,
          descripcion: p.payload.doc.data().descripcion,
          imagen: p.payload.doc.data().imagen,
          // Busco el id del array de categorias para ver si existe 
          categoria: (this.categorias.find(element => element.id == p.payload.doc.data().id_categoria)) ? 
          this.categorias.find(element => element.id == p.payload.doc.data().id_categoria).nombre :'Categoría borrada',
          id_categoria: p.payload.doc.data().id_categoria,
          novedad: p.payload.doc.data().novedad,
          fileRef: p.payload.doc.data().fileRef
        }
      })
     },error=>{
       console.error(error);
     }
     );
  }

  /* Obtener datos de categorias */
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

  guardarProducto(producto: any){
    if(this.produForm.valid){
       this.productosService.preAddUpdateProducto(producto, this.image).then(res => {
        this.produForm.reset();
        this.modalService.dismissAll();
        /* setTimeout(() => 
            {
              this.recuperarProducts();
            },
            2000); */
        //this.recuperarProducts();
      }).catch(error =>{
        console.log(error);
      });  
    }else{
      this.errorMessage='Faltan campos por rellenar';
      if(this.produForm.controls['nombre'].invalid){
        this.classNombre='is-invalid';
      }
      if(this.produForm.controls['descripcion'].invalid){
        this.classDescripcion='is-invalid';
      }
      if(this.produForm.controls['precio'].invalid){
        this.classPrecio='is-invalid';
      }
      if(this.produForm.controls['imagenPro'].invalid){
        this.classImagenPro='is-invalid';
      }
      if(this.produForm.controls['novedad'].invalid){
        this.classNovedad='is-invalid';
      }
      if(this.produForm.controls['id_categoria'].invalid){
        this.classId_Categoria='is-invalid';
      }
    }
    
  }


  eliminarProducto(id: any){
    this.productosService.deleteProductos(id).then(res => {
      this.recuperarProducts();
    }).catch(error =>{
      console.log(error);
    });
  }

  imagenUp(event:any):void{
    if (event.target.files.length > 0) {
      this.image = event.target.files[0];
      this.classImagenPro = 'is-valid';
    }
      this.classImagenPro = '';
  }

  /* Editar Producto */
  async editarProducto(producto: any){
    if(this.produFormEdit.valid){
      if(this.image==this.imageOriginal){
        producto.imagen = this.imageOriginal;
        await this.productosService.updateProductos(producto).then(res =>{
          this.modalService.dismissAll();
          this.recuperarProducts();
        }).catch(error =>{
          console.log(error);
        });
      }else{
        /* Imagen distinta */
        await this.productosService.updateProductos(producto, this.image).then(res =>{
          this.modalService.dismissAll();
          setTimeout(() => 
            {
              this.recuperarProducts();
            },
            2000);
          
        }).catch(error =>{
          console.log(error);
        });
        
      }

   }
   else{
     /* Validaciones */
      this.errorMessage='Faltan campos por rellenar';
      if(this.produFormEdit.controls['nombreE'].invalid){
        this.classNombreE='is-invalid';
      }
      if(this.produFormEdit.controls['descripcionE'].invalid){
        this.classDescripcionE='is-invalid';
      }
      if(this.produFormEdit.controls['precioE'].invalid){
        this.classPrecioE='is-invalid';
      }
      if(this.produFormEdit.controls['imagenProE'].invalid){
        this.classImagenProE='is-invalid';
      }
      if(this.produFormEdit.controls['novedadE'].invalid){
        this.classNovedadE='is-invalid';
      }
      if(this.produFormEdit.controls['id_categoriaE'].invalid){
        this.classId_CategoriaE='is-invalid';
      }
   }
   
 }
 

 /* Modal Editar producto */
 openEditar(content, producto?:any) {
    this.image = producto.imagen;
    this.imageOriginal = producto.imagen; 
    this.produFormEdit.patchValue({
        id: producto.id,
        nombreE: producto.nombre,
        descripcionE: producto.descripcion,
        precioE: producto.precio,
        novedadE: producto.novedad,
        id_categoriaE: producto.id_categoria,
        imagen: producto.imagen,
        fileRef: producto.fileRef
    });
    
   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     this.closeResult = `Closed with: ${result}`;
     this.errorMessage=null;
     this.produFormEdit.reset();
     this.classNombreE = '';
     this.classDescripcionE = '';
     this.classPrecioE = '';
     this.classImagenProE = '';
     this.classNovedadE = '';
     this.classId_CategoriaE = '';
   }, (reason) => {
     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
     this.errorMessage=null;
     this.produFormEdit.reset();
     this.classNombreE = '';
     this.classDescripcionE = '';
     this.classPrecioE = '';
     this.classImagenProE = '';
     this.classNovedadE = '';
     this.classId_CategoriaE = '';
     
   });
 }

//Modal Crear Producto
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.errorMessage=null;
      this.produForm.reset();
      this.classNombre = '';
      this.classDescripcion = '';
      this.classPrecio = '';
      this.classImagenPro = '';
      this.classNovedad = '';
      this.classId_Categoria = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.errorMessage=null;
      this.produForm.reset();
      this.classNombre = '';
      this.classDescripcion = '';
      this.classPrecio = '';
      this.classImagenPro = '';
      this.classNovedad = '';
      this.classId_Categoria = '';
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

  //validaciones
  get nombre(){ return this.produForm.get('nombre'); }
  get descripcion(){ return this.produForm.get('descripcion'); }
  get precio(){ return this.produForm.get('precio'); }
  get novedad(){ return this.produForm.get('novedad'); }
  get id_categoria(){ return this.produForm.get('id_categoria'); }
  get imagenPro(){ return this.produForm.get('imagenPro'); }

  //validaciones Editar
  get nombreE(){ return this.produFormEdit.get('nombreE'); }
  get descripcionE(){ return this.produFormEdit.get('descripcionE'); }
  get precioE(){ return this.produFormEdit.get('precioE'); }
  get novedadE(){ return this.produFormEdit.get('novedadE'); }
  get id_categoriaE(){ return this.produFormEdit.get('id_categoriaE'); }
  get imagenProE(){ return this.produFormEdit.get('imagenProE'); }

}
