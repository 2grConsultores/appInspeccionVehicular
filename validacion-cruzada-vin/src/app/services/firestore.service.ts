import { Injectable, inject } from '@angular/core';
import {
  Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  constructor(public database:Firestore) { 
  }

  // Crea un nuevo registro
  public createDoc(data: {}, path: string, id: string) {
    const coleccion = collection(this.database, path);
    return addDoc(coleccion, data);
  }

  // Obtiene un registro
  public getDoc(path: string, id: string) {
    const coleccion = collection(this.database, path);
    return doc(coleccion, id);
  }

  // Obtiene todos los registros de una colección
  public getCollection(path: string) {
    const coleccion = collection(this.database, path);
    return collectionData(coleccion);
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
