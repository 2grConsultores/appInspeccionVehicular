import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent {

@Input() name?: string;

constructor(
  private router: Router,
  private firestoreService: FirestoreService,
) { }

caso(caso: number){
  this.router.navigate(['ocr/'+caso]);
}

  crearValidacion(){
    const data = {
      usuario: 'usuario',
      fechaInicio: new Date(),
      visibles:{
        listaLecturas:[],
        vin: '',
      },
      obd:{
        vin: '',
        fecha: new Date(),
      },
      nfc:{
        vin: '',
        fecha: new Date(),
      },
      resultado:{
        riesgo: '',
        color: '',
        descripcion: '',
        recomendacion: [],
      }
    };
    this.firestoreService.createDoc(data,'validacion').then(registro => {

      console.log('id registro', registro.id);
      this.router.navigate(['ocr/'+registro.id]);
    });
  };

}
  
