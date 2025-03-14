import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  deleteDoc,
  updateDoc,
  where,
  query,
  orderBy,
  limit,
  startAfter
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { startAt } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  constructor(public database: Firestore,
    private router: Router
  ) { }

  // Crea un nuevo registro
  public createDoc(data: {}, path: string) {
    const coleccion = collection(this.database, path);
    return addDoc(coleccion, data);
  }

  // Función reutilizable para crear una validación
  public async crearValidacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position', coordinates);

      const data = {
        usuario: localStorage.getItem('uid'),
        fechaInicio: new Date(),
        visibles: {
          listaLecturas: [],
          vin: '',
          estacionDisponible: {
            parabrisas: true,
            puerta: true,
            factura: true,
            tarjetaCirculacion: true,
          },
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
        ubicaciones: [
          {
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
            accuracy: coordinates.coords.accuracy,
            heading: coordinates.coords.heading,
            speed: coordinates.coords.speed,
            timestamp: new Date(),
          },
        ],
      };

      const registro = await this.createDoc(data, 'inspecciones');
      console.log('ID del registro creado:', registro.id);
      
      // Redirige a la pantalla de inspección
      this.router.navigate(['tabs/tab2/inspeccion/' + registro.id]);
    } catch (error) {
      console.error('Error al obtener la ubicación o crear la inspección:', error);
    }
  }

  // Obtiene un registro
  public findOne(path: string, id: string): Observable<any> {
    const documentRef = doc(this.database, `${path}/${id}`);
    return docData(documentRef);
  }

  // Obtiene todos los registros de una colección incluyendo el id
  public getCollection(path: string): Observable<any[]> {
    // requiero poder pasar el parametro de uid para filtrar las inspecciones y que solo me etregue las del usuario logueado
    const coleccion = collection(this.database, path);
    return collectionData(coleccion, { idField: 'id' });
  }

  // //obtener inspecciones filtradas por uid
  getInspeccionesByUid(uid: string, pageSize: number, lastFechaInicio: any | null): Observable<any[]> {
    const inspeccionesRef = collection(this.database, 'inspecciones');

    // ✅ Verificar si lastFechaInicio es válido antes de pasarlo
    let inspeccionesQuery = query(
      inspeccionesRef,
      where('usuario', '==', uid),
      orderBy('fechaInicio', 'desc'), // ✅ Ordenar por fechaInicio correctamente
      limit(pageSize)
    );

    if (lastFechaInicio) {
        inspeccionesQuery = query(inspeccionesQuery, startAfter(lastFechaInicio)); // ✅ Usar Timestamp original
    }

    // console.log('lastFechaInicio:', lastFechaInicio);
    // console.log('Query:', inspeccionesQuery);

    return collectionData(inspeccionesQuery, { idField: 'id' }) as Observable<any[]>;
}



  // Actualiza un registro
  public updateDoc(data: {}, path: string, id: string) {
    const coleccion = collection(this.database, path);
    return updateDoc(doc(coleccion, id), data);
  }

  // Elimina un registro
  public deleteDoc(path: string, id: string) {
    const coleccion = collection(this.database, path);
    return deleteDoc(doc(coleccion, id));
  }
}

