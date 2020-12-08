import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { UserI } from 'src/app/models/user.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { RoleValidator } from 'src/app/models/roleValidator';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers:[LoginService]
})
export class FooterComponent extends RoleValidator implements OnInit {
  public user$: Observable<UserI> = this.loginSvc.user$;
  closeResult = '';

  
  
  constructor(private loginSvc: LoginService, private modalService: NgbModal,) {
    super();
   }

  ngOnInit(): void {
    
  }

  isClientee():Observable<boolean> | Promise<boolean> | boolean{
    return this.loginSvc.user$.pipe(
      take(1),
      map((user) => user && this.loginSvc.isCliente(user)),
      tap((canClient) => {
        if (!canClient) {
          window.alert('Acceso denegado');
        }
      })
    );
  }

  //Modal Pedido
  open(content) {
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true, size: 'xl'}).result.then((result) => {
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
