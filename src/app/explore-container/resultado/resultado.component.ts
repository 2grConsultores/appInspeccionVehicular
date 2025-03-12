import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AlertController } from '@ionic/angular';
import { validacionInt } from 'src/app/interfaces/validacion.interfaces';
import { HttpClient } from '@angular/common/http';
import * as Handlebars from 'handlebars';
import { GoogleMap } from '@capacitor/google-maps';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
})
export class ResultadoComponent  implements OnInit {
  validacionId: string = '';
  validacionData: validacionInt = {
    id: '',
    usuario: '',
    fechaInicio: { seconds: 0, nanoseconds: 0 },
    fechaFin: new Date(),
    visibles: {
      listaLecturas: [
        {
          posicion: '',
          vinOCR: '',
          vinEditado: '',
          editado: false,
          fecha: new Date(),
          imagen: {
            url: '',
          },
        },
      ],
      vin: '',
    },
    obd: {
      vin: '',
      fecha: new Date(),
    },
    nfc: {
      vin: '',
      fecha: new Date(),
    },
    fotos: [
      {
        imagen: {
          url: '',
        },
        posicion: '',
        fecha: new Date(),
      },
    ],
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
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        heading: 0,
        speed: 0,
        timestamp: 0,
      },
    ]
  };
  latitud: number = 0;
  longitud: number = 0;
  fechaInicialInspeccion: string = '';


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    public alertController: AlertController,
    private http: HttpClient,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      // aqui obtengo el id del registro
      this.validacionId = id;
    
      this.obtenerDatosValidacion(this.validacionId);
      if (this.validacionData?.ubicaciones) {
        console.log('Coordenadas recibidas:', this.validacionData.ubicaciones[0].latitude, this.validacionData.ubicaciones[0].longitude);
      } else {
        console.warn('No se encontraron coordenadas de ubicación.');
      }
    });
  }


  linkCapturaHome(){
    this.router.navigate(['tabs/tab2/inspeccion/' + this.validacionId]);
  }

  obtenerDatosValidacion(validacionId: string) {
    this.firestoreService
      .findOne('inspecciones', validacionId)
      .subscribe((validacion: validacionInt) => {
        console.log('validacion Datos:', validacion);
        this.validacionData = validacion;
        if (this.validacionData.ubicaciones){
          this.latitud = this.validacionData.ubicaciones[0].latitude;
          this.longitud = this.validacionData.ubicaciones[0].longitude;
        }
        let dateInicio = new Date();
        if(this.validacionData.fechaInicio){
          dateInicio =new Date(this.validacionData.fechaInicio.seconds * 1000);
          console.log('fechaInicio:', dateInicio);
        }
        this.fechaInicialInspeccion = this.datePipe.transform(
          dateInicio,
          'dd/MM/yyyy HH:mm:ss'
        ) || '';
        console.log('fechaInicialInspeccion', this.fechaInicialInspeccion);
      });
  }

  async enviarEmail() {

  // Cargar la plantilla HTML desde assets
  const templateSource = await this.http.get('assets/templates/email-template.html', { responseType: 'text' }).toPromise();

  // Compilar la plantilla con Handlebars
  const template = Handlebars.compile(templateSource);

  // Registrar el helper `isOdd`
  Handlebars.registerHelper('isOdd', function (index) {
    return index % 2 !== 0;
  });

  // Registrar el helper `isEven`
  Handlebars.registerHelper('isEven', function (index) {
    return index % 2 === 0;
  });

  // Registrar helper para formatear fechas
  Handlebars.registerHelper('formatDate', function (timestamp) {
    if (!timestamp) return 'Fecha no disponible';
    
    const date = new Date(timestamp * 1000); // Convertir segundos a milisegundos
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  });

  //agregar el id de la validacion al objeto
  this.validacionData.id = this.validacionId;

  const googleMapsUrl = `https://www.google.com/maps?q=${this.latitud},${this.longitud}`;
  Handlebars.registerHelper('googleMapsUrl', function () {
    return googleMapsUrl;
  }
  );

  // Generar el HTML final del correo
  const htmlFinal = template(this.validacionData);

  // console.log('Correo generado:', htmlFinal);

    const data = {
      to: [localStorage.getItem('email')],
      message: {
        subject: 'Resultado de la inspección'+this.validacionId,
        text: JSON.stringify(this.validacionData), // JSON.stringify(this.validacionData),
        html: htmlFinal,
      }
    };

    this.firestoreService.createDoc(data, 'mail').then((result) => {
      console.log(result);
      this.presentAlert('Mensaje', 'Mail enviado correctamente');
    }).catch((error) => {
      this.presentAlert('Error', 'Error al enviar el mail');
    });

  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
