import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    // private router: Router,
    private firestoreService: FirestoreService,
  ) {}

  // crearValidacion() {
  //   const data = {
  //     usuario: localStorage.getItem('uid'),
  //     fechaInicio: new Date(),
  //     visibles: {
  //       listaLecturas: [],
  //       vin: '',
  //     },
  //     obd: {
  //       vin: '',
  //       fecha: new Date(),
  //     },
  //     nfc: {
  //       vin: '',
  //       fecha: new Date(),
  //     },
  //     fotos: [],
  //     resultado: {
  //       riesgo: '',
  //       color: '',
  //       descripcion: '',
  //       recomendacion: [],
  //     },
  //     decodificacionVin: {
  //       marca: '',
  //       modelo: '',
  //       anioModelo: '',
  //       pais: '',
  //       completada: false,
  //       fecha: new Date(),
  //     },
  //   };
  //   this.firestoreService.createDoc(data, 'inspecciones').then((registro) => {
  //     console.log('id registro', registro.id);
  //     this.router.navigate(['tabs/tab2/inspeccion/' + registro.id]);
  //   });
  // }
  
  crearValidacion() {
    this.firestoreService.crearValidacion();
  }


}
