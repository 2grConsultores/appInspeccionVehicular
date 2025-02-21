import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NhtsaService {
  constructor(public http: HttpClient) {}
  getLabels(vin: string) {
    let infoVin = {
      marca: '',
      modelo: '',
      anioModelo: '',
      pais: '',
    };
    const respuesta = this.http.get(
      'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/' +
        vin +
        '?format=json'
    );
    respuesta.subscribe((data: any) => {
      const datos = data.Results;
      datos.forEach((item: { Value: string; Variable: string }) => {
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
    });

    return infoVin;
  }
}
