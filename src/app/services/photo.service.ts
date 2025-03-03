import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export interface PhotoInt {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: PhotoInt[] = [];

  image: any;

  constructor(private firestore: Firestore, private storage: Storage) {}

  public async takePhoto_to_url(path: string, inspeccionId: string) {
    try {
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 100,
        // allowEditing: false,
        source: CameraSource.Camera,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });
      // console.log('image: ', image);
      this.image = image.dataUrl;
      const blob = this.dataURLtoBlob(image.dataUrl);
      const url = await this.uploadImage(blob, image, path, inspeccionId);
      console.log('url-service', url);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async takePhoto() {
    // Take a photo to base64
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
      width: 500,
      height: 500,
    });
    return capturedPhoto;
  }

  dataURLtoBlob(dataurl: any) {
    if (typeof dataurl !== 'string') {
      throw new Error('El parámetro dataurl debe ser una cadena de texto.');
    }

    const arr = dataurl.split(',');
    if (arr.length < 2) {
      throw new Error('La data URL no está en el formato esperado.');
    }

    const match = arr[0].match(/:(.*?);/);
    if (!match) {
      throw new Error('No se pudo extraer el MIME type de la data URL.');
    }

    var mime = match[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  async uploadImage(
    blob: any,
    imageData: any,
    path: string,
    inspeccionId: string
  ) {
    try {
      const currentDate = Date.now();
      const filePath = `${path}/${inspeccionId}_${currentDate}.${imageData.format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      // console.log('task: ', task);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (e) {
      throw e;
    }
  }

  //requiero una funcion para que a partir de una imagen en base64 me devuelva un blob
  //para poder subirlo a firebase storage
  base64toBlob(
    base64Data: string,
    contentType: string,
    sliceSize: number = 512
  ): Blob {
    // Si la cadena tiene el prefijo data:, se extrae el contentType y la parte base64
    if (base64Data.startsWith('data:')) {
      const parts = base64Data.split(';base64,');
      if (parts.length === 2) {
        contentType = parts[0].split(':')[1]; // extrae, por ejemplo, "image/jpeg"
        base64Data = parts[1];
      }
    }

    const byteCharacters = atob(base64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
