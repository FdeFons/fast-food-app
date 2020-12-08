import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { categoriaI } from 'src/app/models/categoria.interface';
import { CategoriasService } from 'src/app/services/categorias.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  public errorMessage: string;
  closeResult = '';
  config: any;
  categorias = [];
  cateForm: FormGroup;
  private image: any;
  //public categoria$: Observable<categoriaI[]>;

  // validaciones
  classImagenCat = '';
  classNombre = '';
  imagenValid = /(.jpg|.jpeg|.png|.gif)$/i;
  // validaciones Editar
  classNombreE = '';
  classImagenCatE = '';
  //para editar categoría
  private imageOriginal: any;
  cateFormEdit: FormGroup;
  

  constructor(
    private categoriasService: CategoriasService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    /* Configuración de la paginación */
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.categorias.length
    };
    /* Formulario Editar Categoría */
    this.cateFormEdit = this.fb.group({
      id: new FormControl('', Validators.required),
      nombreE: new FormControl('', Validators.required),
      imagenCatE: new FormControl('', [Validators.required ,Validators.pattern(this.imagenValid)]),
      fileRef: new FormControl('', Validators.required)

    })
    /* Formulario Crear Categoría */
    this.cateForm = this.fb.group({
      nombre: new FormControl('', Validators.required),
      imagenCat: new FormControl('', [Validators.required ,Validators.pattern(this.imagenValid)])
    })
    
    /* Obtener categorias */
    this.recuperar();

  }
  /* Paginación */
  pageChanged(event){
    this.config.currentPage = event;
  }


  //CRUD
  recuperar(){
    this.categoriasService.getAllCategorias().subscribe(res => {
      this.categorias =  res.map((c: any) => {
        return{
          id: c.payload.doc.id,
          nombre: c.payload.doc.data().nombre,
          imagen: c.payload.doc.data().imagen,
          fileRef: c.payload.doc.data().fileRef
        }
      }); //console.log('categorias subscribe', this.categorias );    // aqui vemos que cuando hay un cambio en la base de datos vuelve a obtener los datos, pero no vienen actualizados :(
    },
      error=>{
        console.log(error);
    }
    );
  }

  /* Gaurdar Categoría */
  guardarCategoria(data: categoriaI){
    if(this.cateForm.valid){
      this.categoriasService.preAddUpdateCategoria(data, this.image).then(res => {
        this.cateForm.reset();
        this.modalService.dismissAll();
        this.recuperar();
      }).catch(error =>{
        console.log(error);
      });  
    }else{
      this.errorMessage='Faltan campos por rellenar';
      if(this.cateForm.controls['nombre'].invalid){
        this.classNombre='is-invalid';
      }
      if(this.cateForm.controls['imagenCat'].invalid){
        this.classImagenCat='is-invalid';
      }
    }

  }

  /* Obtener evento de la imagen */
  imagenUp(event:any):void{
    if (event.target.files.length > 0) {
      this.image = event.target.files[0];
      this.classImagenCat = 'is-valid';
    }
      this.classImagenCat = '';
  }

  /* Eliminar categoría  */
  eliminarCategoria(id: any){
    this.categoriasService.deleteCategorias(id).then(res => {
      this.recuperar();
    }).catch(error =>{
      console.log(error);
    });
  }

  /* Editar Categoria */
  async editarCategoria(categoria: any){
    if(this.cateFormEdit.controls['nombreE'].valid){
      // Comprueba si hay imagen nueva
      if(this.image==this.imageOriginal){
        categoria.imagen = this.imageOriginal;
        await this.categoriasService.updateCategorias(categoria).then(res =>{
          this.modalService.dismissAll();
          this.recuperar();
        }).catch(error =>{
          console.log(error);
        });
      }else{
        // Si la imagen es distinta
        await this.categoriasService.updateCategorias(categoria, this.image).then(res =>{
          this.modalService.dismissAll();
          setTimeout(() => 
          {
               this.recuperar();
          },
          2000);
          
        }).catch(error =>{
          console.log(error);
        });
      }
  
    }else{
      this.errorMessage='Faltan campos por rellenar';
      this.classNombreE='is-invalid';
    }
    
  }

  /* Modal Editar categoría */
  openEditar(content, categoria?:any) {
     this.image = categoria.imagen;
     this.imageOriginal = categoria.imagen; 
     this.cateFormEdit.patchValue({
       id: categoria.id,
       nombreE: categoria.nombre,
       fileRef: categoria.fileRef
     });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.errorMessage=null;
      this.cateFormEdit.reset();
      this.classNombreE='';
      this.classImagenCatE='';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.errorMessage=null;
      this.cateFormEdit.reset();
      this.classNombreE='';
      this.classImagenCatE='';
    });
  }

  /* Modal añadir Categoría */
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.errorMessage=null;
      this.cateForm.reset();
      this.classNombre='';
      this.classImagenCat='';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.errorMessage=null;
      this.cateForm.reset();
      this.classNombre='';
      this.classImagenCat='';
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
  
  /* Coger los nombres del formulario para las validaciones */
  /* Crear */
  get nombre(){ return this.cateForm.get('nombre'); }
  get imagenCat(){ return this.cateForm.get('imagenCat'); }

  /* Editar */
  get nombreE(){ return this.cateFormEdit.get('nombreE'); }
  get imagenCatE(){ return this.cateFormEdit.get('imagenCatE'); }
  
}