import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { DatePipe } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  datasources: any[] = [];
  usuario: string = '';

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private datePipe: DatePipe,

  ) {}

  ngOnInit() {
    this.obtenerInspecciones();
    

  }

  crearValidacion() {
    const data = {
      usuario: localStorage.getItem('uid'),
      fechaInicio: new Date(),
      visibles: {
        listaLecturas: [],
        vin: '',
      },
      obd: {
        vin: '',
        fecha: new Date(),
      },
      nfc: {
        vin: '',
        fecha: new Date(),
      },
      fotos: [],
      resultado: {
        riesgo: '',
        color: '',
        descripcion: '',
        recomendacion: [],
      },
      decodificacionVin: {
        marca: '',
        modelo: '',
        anioModelo: '',
        pais: '',
        completada: false,
        fecha: new Date(),
      },
    };
    this.firestoreService.createDoc(data, 'inspecciones').then((registro) => {
      console.log('id registro', registro.id);
      this.router.navigate(['tabs/tab2/inspeccion/' + registro.id]);
    });
  }

  ver(id: string) {
    this.router.navigate(['tabs/tab2/inspeccion/' + id]);
  }

  obtenerInspecciones() {
    // Obtener el uid del usuario logueado desde localStorage
    const uid = localStorage.getItem('uid');
    if (uid) {
      // Ejecutar el query para obtener solo las inspecciones del usuario
      this.firestoreService.getInspeccionesByUid(uid)
        .subscribe((data: any[]) => {
          // Formatear el campo fechaInicio para cada inspección, si existe
          const inspeccionesFormateadas = data.map(doc => {
            if (doc.fechaInicio && doc.fechaInicio.seconds) {
              const dateInicio = new Date(doc.fechaInicio.seconds * 1000);
              doc.fechaInicio = this.datePipe.transform(dateInicio, 'dd/MM/yyyy HH:mm:ss');
            }
            return doc;
          });
          this.datasources = inspeccionesFormateadas;
          console.log('datasource:', this.datasources);
        });
    } else {
      console.error('UID is null');
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    // this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
