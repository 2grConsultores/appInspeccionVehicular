import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AlertController } from '@ionic/angular';
import { validacionInt } from 'src/app/interfaces/validacion.interfaces';
import { HttpClient } from '@angular/common/http';
import * as Handlebars from 'handlebars';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
})
export class ResultadoComponent  implements OnInit {
  validacionId: string = '';
  validacionData: validacionInt = {
    usuario: '',
    fechaInicio: new Date(),
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
  };


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    public alertController: AlertController,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      // aqui obtengo el id del registro
      this.validacionId = id;
      this.obtenerDatosValidacion(this.validacionId);
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
      });
  }

  async enviarEmail() {

  // Cargar la plantilla HTML desde assets
  const templateSource = await this.http.get('assets/templates/email-template.html', { responseType: 'text' }).toPromise();

  // Compilar la plantilla con Handlebars
  const template = Handlebars.compile(templateSource);

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
