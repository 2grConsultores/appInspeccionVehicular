import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NhtsaService {
  constructor(private http: HttpClient) {}

  async getLabels(vin: string): Promise<{ marca: string; modelo: string; anioModelo: string; pais: string }> {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
    // Convierto el observable a Promise y espero la respuesta
    const data: any = await lastValueFrom(this.http.get(url));
    let infoVin = {
      marca: '',
      modelo: '',
      anioModelo: '',
      pais: '',
      completada: true,
      fecha: new Date()
    };

    if (data && data.Results) {
      data.Results.forEach((item: { Value: string; Variable: string }) => {
        switch (item.Variable) {
          case 'Make':
            infoVin.marca = item.Value;
            break;
          case 'Model':
            infoVin.modelo = item.Value;
            break;
          case 'Model Year':
            infoVin.anioModelo = item.Value;
            break;
          case 'Plant Country':
            infoVin.pais = item.Value;
            break;
          default:
            break;
        }
      });
    }
    return infoVin;
  }
}

