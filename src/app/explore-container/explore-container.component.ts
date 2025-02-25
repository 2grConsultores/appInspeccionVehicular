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

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerInspecciones();

  }

  crearValidacion() {
    const data = {
      usuario: 'usuario',
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
    this.firestoreService.getCollection('inspecciones').subscribe((data: any[]) => {
      // Mapear cada documento para formatear las marcas de tiempo
      // this.datasources = data.map(doc => {
      //   // Formatear el campo "fechaInicio" si existe
      //   if (doc.fechaInicio && doc.fechaInicio.seconds) {
      //     const dateInicio = new Date(doc.fechaInicio.seconds * 1000);
      //     doc.fechaInicio = this.datePipe.transform(dateInicio, 'dd/MM/yyyy HH:mm:ss');
      //   }
      // });
      this.datasources = data;
      console.log(this.datasources );
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    // this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
