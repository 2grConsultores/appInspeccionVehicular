import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { PhotoService } from 'src/app/services/photo.service';
import { validacionInt } from 'src/app/interfaces/validacion.interfaces';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss'],
})
export class FotosComponent  implements OnInit {

  url_frente: string = '../../../assets/botonesVisibles/frente.webp';
  url_atras: string = '../../../assets/botonesVisibles/atras.webp';
  url_lateral_derecho: string = '../../../assets/botonesVisibles/lateral_derecho.webp';
  url_lateral_izquierdo: string = '../../../assets/botonesVisibles/lateral_izquierdo.webp';
  url_exterior1: string = '../../../assets/botonesVisibles/exterior_1.webp';
  url_exterior2: string = '../../../assets/botonesVisibles/exterior_2.webp';
  url_motor: string = '../../../assets/botonesVisibles/motor.webp';
  url_cajuela: string = '../../../assets/botonesVisibles/cajuela.webp';
  url_tablero: string = '../../../assets/botonesVisibles/tablero.webp';
  url_interior1: string = '../../../assets/botonesVisibles/interior_1.webp';
  url_interior2: string = '../../../assets/botonesVisibles/interior_2.webp';
  url_interior3: string = '../../../assets/botonesVisibles/interior_3.webp';
  url_interior4: string = '../../../assets/botonesVisibles/interior_4.webp';
  url_interior5: string = '../../../assets/botonesVisibles/interior_5.webp';

  capturaFrente: boolean = false;
  capturaAtras: boolean = false;
  capturaLadoIzquierdo: boolean = false;
  capturaLadoDerecho: boolean = false;
  capturaExterior1: boolean = false;
  capturaExterior2: boolean = false;
  capturaMotor: boolean = false;
  capturaCajuela: boolean = false;
  capturaTablero: boolean = false;
  capturaInterior1: boolean = false;
  capturaInterior2: boolean = false;
  capturaInterior3: boolean = false;
  capturaInterior4: boolean = false;
  capturaInterior5: boolean = false;
  fotoImage_url: string = '';
  posicion: string = '';
  validacionId: string = '';
  arregloResultados: any[] = [];
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
    },
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private photoService: PhotoService,
    public alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      // aqui obtengo el id del registro
      // this.obtenercasos(id);
      this.validacionId = id;
      console.log('validacionId', this.validacionId);
      this.obtenerDatosValidacion(this.validacionId);
    });

    console.log('arreglo onInit', this.arregloResultados);
  }

  async agregaFoto(posicion: string) {

    const path = 'fotos/'+posicion;
    await this.photoService.takePhoto_to_url(path).then((url: any) => {
      console.log('url-componente', url);
      this.fotoImage_url = url;
      this.posicion = posicion;
      // requiero una funcion que guarde la url en la base de datos
      this.guardarFoto();
      switch (posicion) {
        case 'frente':
          this.capturaFrente = true;
          this.url_frente = url;
          break;
        case 'atras':
          this.capturaAtras = true;
          this.url_atras = url;
          break;
        case 'lado-izquierdo':
          this.capturaLadoIzquierdo = true;
          this.url_lateral_izquierdo = url;
          break;
        case 'lado-derecho':
          this.capturaLadoDerecho = true;
          this.url_lateral_derecho = url;
          break;
        case 'exterior1':
          this.capturaExterior1 = true;
          this.url_exterior1 = url;
          break;
        case 'exterior2':
          this.capturaExterior2 = true;
          this.url_exterior2 = url;
          break;
        case 'motor':
          this.capturaMotor = true;
          this.url_motor = url;
          break;
        case 'cajuela':
          this.capturaCajuela = true;
          this.url_cajuela = url;
          break;
        case 'tablero':
          this.capturaTablero = true;
          this.url_tablero = url;
          break;
        case 'interior1':
          this.capturaInterior1 = true;
          this.url_interior1 = url;
          break;
        case 'interior2':
          this.capturaInterior2 = true;
          this.url_interior2 = url;
          break;
        case 'interior3':
          this.capturaInterior3 = true;
          this.url_interior3 = url;
          break;
        case 'interior4':
          this.capturaInterior4 = true;
          this.url_interior4 = url;
          break;
        case 'interior5':
          this.capturaInterior5 = true;
          this.url_interior5 = url;
          break;
        default:
          break;
      }
 

    });
  }

  guardarFoto() {
    console.log('guardarFoto');
    const foto = {
      imagen: {
        url: this.fotoImage_url,
      },
      posicion: this.posicion,
      fecha: new Date(),
    };
    console.log('foto', foto);
    
    this.firestoreService.updateDoc({fotos: this.validacionData.fotos.concat(foto),},'inspecciones', this.validacionId );
  };

  obtenerDatosValidacion(validacionId: string) {
    this.firestoreService
      .findOne('inspecciones', validacionId)
      .subscribe((validacion: validacionInt) => {
        console.log('validacion Datos:', validacion);
        this.validacionData = validacion;
      });
  }

}
