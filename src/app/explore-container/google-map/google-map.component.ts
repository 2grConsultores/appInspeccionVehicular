import { Component, AfterViewInit, Input, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

// declare const google: any; // Declarar google para evitar errores de TypeScript

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  @Input() lat!: number;
  @Input() lng!: number;
  map!: GoogleMap;



  async ngAfterViewInit() {
    console.log('Iniciando Google Map...');
    await this.loadMap();
  }

  async loadMap() {
    const apiKey = environment.googleMaps;
    console.log('lat', this.lat);
    console.log('lng', this.lng);

    if (!this.lat || !this.lng) {
      console.error('No se proporcionaron coordenadas de ubicación.');
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error('Google Maps no está disponible');
      return;
    }

    this.map = await GoogleMap.create({
      id: 'my-map',
      element: this.mapElement.nativeElement,
      apiKey: apiKey,
      config: {
        center: { lat: this.lat, lng: this.lng },
        zoom: 15,
      },
    });

    await this.map.addMarker({
      coordinate: { lat: this.lat, lng: this.lng },
      title: 'Ubicación de la inspección',
    });
  }
}

