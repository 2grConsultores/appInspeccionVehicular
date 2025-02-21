import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NhtsaService {
  constructor(public http: HttpClient) {}
  getLabels(vin: string) {
    return this.http.get(
      'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/' +
        vin +
        '?format=json'
    );
  }
}
