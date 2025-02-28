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
  query
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  constructor(public database: Firestore) { }

  // Crea un nuevo registro
  public createDoc(data: {}, path: string) {
    const coleccion = collection(this.database, path);
    return addDoc(coleccion, data);
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

  //obtener inspecciones filtradas por uid
  getInspeccionesByUid(uid: string): Observable<any[]> {
    // Referencia a la colección 'inspecciones'
    const inspeccionesRef = collection(this.database, 'inspecciones');
    // Crear el query aplicando el filtro por uid
    const inspeccionesQuery = query(inspeccionesRef, where('usuario', '==', uid));
    // Retornar los datos de la consulta, incluyendo el id de cada documento
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

