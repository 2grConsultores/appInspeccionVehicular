import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { validacionInt } from 'src/app/interfaces/validacion.interfaces';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inspeccion',
  templateUrl: './inspeccion.component.html',
  styleUrls: ['./inspeccion.component.scss'],
})
export class InspeccionComponent  implements OnInit {

  validacionId: string = '';
  arregloResultados: any[] = [];
  validacionData: any = {};

  fechaInicialInspeccion: string = '';
  ocrConcluido: boolean = false;
  fotosConcluido: boolean = false;
  obdConluido: boolean = false;
  ineConcluido: boolean = false;
  carfaxConcluido: boolean = false;


    constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private firestoreService: FirestoreService,
      public alertController: AlertController,
      private loadingCtrl: LoadingController,
      private datePipe: DatePipe,
    ) {}

    ngOnInit() {
      this.activatedRoute.params.subscribe(({ id }) => {
        // aqui obtengo el id del registro
        this.validacionId = id;
        this.obtenerDatosValidacion(this.validacionId);
      });
  
      console.log('arreglo onInit', this.arregloResultados);
    }

    obtenerDatosValidacion(validacionId: string) {
      this.firestoreService
        .findOne('inspecciones', validacionId)
        .subscribe((validacion: validacionInt) => {
          console.log('validacion Datos:', validacion);
          this.validacionData = validacion;
          const dateInicio =new Date(this.validacionData.fechaInicio.seconds * 1000);
          this.fechaInicialInspeccion = this.datePipe.transform(
            dateInicio,
            'dd/MM/yyyy HH:mm:ss'
          ) || '';
          console.log('fechaInicialInspeccion', this.fechaInicialInspeccion);
          if (this.validacionData.visibles.listaLecturas.length >= 4) {
            this.ocrConcluido = true;
          }
          if (this.validacionData.fotos.length >= 5) {
            this.fotosConcluido = true;
          }
          if (this.validacionData.obd.vin !== '') {
            this.obdConluido = true;
          }
        });
    }

    // linktoOCR() {
    //   this.router.navigate(['tabs/tab2/ocr/' + this.validacionId ]);
    // }

    // linktoFotos() {
    //   this.router.navigate(['tabs/tab2/fotos/' + this.validacionId ]);
    // }

    // linktoResultado() {
    //   this.router.navigate(['tabs/tab2/resultado/' + this.validacionId ]);
    // }

    link(servicio: string) {
      this.router.navigate([`tabs/tab2/${servicio}/${this.validacionId}`]);
    }

}
