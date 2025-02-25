// import { Injectable, inject } from '@angular/core';
// import {
//   Firestore, addDoc, collection, collectionData,
//   doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, DocumentSnapshot
// } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class FirestoreService {
  
//   constructor(public database:Firestore) { 
//   }

//   // Crea un nuevo registro
//   public createDoc(data: {}, path: string) {
//     const coleccion = collection(this.database, path);
//     return addDoc(coleccion, data);
//   }

//   // Obtiene un registro
//   public findOne(path: string, id: string) : Observable<any> {
//     const documentRef = doc(this.database, `${path}/${id}`);
//     return docData(documentRef);
//   }

//   // Obtiene todos los registros de una colección
//   public getCollection(path: string) {
//     const coleccion = collection(this.database, path);
//     return collectionData(coleccion);
//   }

//   // Actualiza un registro
//   public updateDoc(data: {}, path: string, id: string) {
//     const coleccion = collection(this.database, path);
//     return updateDoc(doc(coleccion, id), data);
//   }

//   // Elimina un registro
//   public deleteDoc(path: string, id: string) {
//     const coleccion = collection(this.database, path);
//     return deleteDoc(doc(coleccion, id));
//   }



// }

import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
    const coleccion = collection(this.database, path);
    return collectionData(coleccion, { idField: 'id' });
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

