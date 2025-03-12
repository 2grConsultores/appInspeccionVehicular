import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { DatePipe } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {

  uid: string = '';
  datasources: any[] = [];  // Almacena las inspecciones cargadas
  pageSize = 10;  // Cantidad de inspecciones por carga
  lastTimestamp: string | null = null; // Última fecha para la paginación
  isLoading = false; // Evita múltiples llamadas
  lastDoc: any | null = null; // Almacenar el último documento para paginación
  subscription: Subscription | null = null;
  infiniteScrollDisabled = false; // Deshabilitar Infinite Scroll

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private datePipe: DatePipe,

  ) {}

  ngOnInit() {
    this.obtenerInspecciones();
  }

  crearValidacion() {
    this.firestoreService.crearValidacion();
  }

  ver(id: string) {
    this.router.navigate(['tabs/tab2/inspeccion/' + id]);
  }


  obtenerInspecciones() {
    this.isLoading = true;
    this.uid = localStorage.getItem('uid') || '';
    
    if (this.uid) {
      if (this.subscription) {
        this.subscription.unsubscribe(); // Evita múltiples suscripciones
      }
  
      this.subscription = this.firestoreService.getInspeccionesByUid(this.uid, this.pageSize, null)
        .subscribe((data: any[]) => {
          // ✅ Convertir `Timestamp` a `Date`
          this.datasources = data.map(doc => ({
            ...doc,
            fechaInicio: doc.fechaInicio?.seconds ? new Date(doc.fechaInicio.seconds * 1000) : doc.fechaInicio
          }));
  
          this.lastDoc = data.length > 0 ? data[data.length - 1] : null;
          this.isLoading = false;
  
          console.log('datasource:', this.datasources);
        });
    } else {
      console.error('UID is null');
    }
  }


  async onIonInfinite(event: InfiniteScrollCustomEvent) {
    console.log('🚀 Evento:', event);
    if (this.isLoading || !this.lastDoc) {
      event.target.complete();
      return;
    }
  
    this.isLoading = true;
  
    this.firestoreService.getInspeccionesByUid(this.uid, this.pageSize, this.lastDoc.fechaInicio)
      .subscribe((data: any[]) => {
        // console.log('🚀 Data recibida:', data);
        // console.log('📌 Datasources antes de actualizar:', this.datasources);
  
        if (data.length === 0) {
          console.log('⚠️ No hay más datos para cargar. Deshabilitando Infinite Scroll.');
          this.infiniteScrollDisabled = true; // ✅ Deshabilitar Infinite Scroll
          event.target.complete();
          this.isLoading = false;
          return;
        }
  
        // ✅ Convertir `fechaInicio` de nuevos registros a `Date`
        const nuevosRegistros = data.map(doc => ({
          ...doc,
          fechaInicio: doc.fechaInicio?.seconds ? new Date(doc.fechaInicio.seconds * 1000) : doc.fechaInicio
        })).filter(nuevo => !this.datasources.some(existente => existente.id === nuevo.id));
  
        // console.log('🆕 Nuevos registros filtrados:', nuevosRegistros);
  
        if (nuevosRegistros.length > 0) {
          this.datasources = [...this.datasources, ...nuevosRegistros];
          this.lastDoc = data[data.length - 1]; // ✅ Guardar el último documento
        } else {
          console.log('⚠️ No se encontraron nuevos registros. Deshabilitando Infinite Scroll.');
          this.infiniteScrollDisabled = true; // ✅ Deshabilitar si no hay más datos
        }
  
        setTimeout(() => {
          event.target.complete();
          this.isLoading = false;
        }, 500);
  
        // console.log('📌 Datasources después de actualizar:', this.datasources);
        // console.log('📌 Último documento (lastDoc):', this.lastDoc);
      });
  }
  
  
  

}
