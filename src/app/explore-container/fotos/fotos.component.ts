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

  // Variables para el spinner (estado de carga de cada imagen)
  isLoadingFrente: boolean = true;
  isLoadingAtras: boolean = true;
  isLoadingLateralDerecho: boolean = true;
  isLoadingLateralIzquierdo: boolean = true;
  isLoadingExterior1: boolean = true;
  isLoadingExterior2: boolean = true;
  isLoadingMotor: boolean = true;
  isLoadingCajuela: boolean = true;
  isLoadingTablero: boolean = true;
  isLoadingInterior1: boolean = true;
  isLoadingInterior2: boolean = true;
  isLoadingInterior3: boolean = true;
  isLoadingInterior4: boolean = true;
  isLoadingInterior5: boolean = true;

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
    console.log('agregaFoto', posicion);
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
 
      this.setLoadingState(posicion, true);
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
  
    // Asegúrate de que validacionData.fotos sea un arreglo; en caso de que no lo sea, lo inicializas.
    const fotosActualizadas = this.validacionData.fotos ? [...this.validacionData.fotos] : [];
  
    // Buscar si ya existe una foto con la misma posición
    const index = fotosActualizadas.findIndex(item => item.posicion === this.posicion);
    if (index > -1) {
      // Si existe, se sobrescribe el elemento
      fotosActualizadas[index] = foto;
    } else {
      // Si no existe, se agrega la nueva foto
      fotosActualizadas.push(foto);
    }
  
    // Actualizamos el documento en Firestore con el arreglo de fotos modificado
    this.firestoreService.updateDoc({ fotos: fotosActualizadas }, 'inspecciones', this.validacionId );
  }

  obtenerDatosValidacion(validacionId: string) {
    this.firestoreService
      .findOne('inspecciones', validacionId)
      .subscribe((validacion: validacionInt) => {
        console.log('validacion Datos:', validacion);
        this.validacionData = validacion;
        if (this.validacionData && this.validacionData.fotos) {
          this.validacionData.fotos.forEach(foto => {
            switch (foto.posicion) {
              case 'frente':
                this.url_frente = foto.imagen.url;
                this.capturaFrente = true;
                break;
              case 'atras':
                this.url_atras = foto.imagen.url;
                this.capturaAtras = true;
                break;
              case 'lateral_derecho':
                this.url_lateral_derecho = foto.imagen.url;
                this.capturaLadoDerecho = true;
                break;
              case 'lateral_izquierdo':
                this.url_lateral_izquierdo = foto.imagen.url;
                this.capturaLadoIzquierdo = true;
                break;
              case 'exterior_1':
                this.url_exterior1 = foto.imagen.url;
                this.capturaExterior1 = true;
                break;
              case 'exterior_2':
                this.url_exterior2 = foto.imagen.url;
                this.capturaExterior2 = true;
                break;
              case 'motor':
                this.url_motor = foto.imagen.url;
                this.capturaMotor = true;
                break;
              case 'cajuela':
                this.url_cajuela = foto.imagen.url;
                this.capturaCajuela = true;
                break;
              case 'tablero':
                this.url_tablero = foto.imagen.url;
                this.capturaTablero = true;
                break;
              case 'interior_1':
                this.url_interior1 = foto.imagen.url;
                this.capturaInterior1 = true;
                break;
              case 'interior_2':
                this.url_interior2 = foto.imagen.url;
                this.capturaInterior2 = true;
                break;
              case 'interior_3':
                this.url_interior3 = foto.imagen.url;
                this.capturaInterior3 = true;
                break;
              case 'interior_4':
                this.url_interior4 = foto.imagen.url;
                this.capturaInterior4 = true;
                break;
              case 'interior_5':
                this.url_interior5 = foto.imagen.url;
                this.capturaInterior5 = true;
                break;
              default:
                break;
            }
          });
        }
      });
  }

   // Esta función se ejecuta cuando la imagen se ha cargado o ocurre un error
   onImageLoad(position: string) {
    switch (position) {
      case 'frente':
        this.isLoadingFrente = false;
        break;
      case 'atras':
        this.isLoadingAtras = false;
        break;
      case 'lateral_derecho':
        this.isLoadingLateralDerecho = false;
        break;
      case 'lateral_izquierdo':
        this.isLoadingLateralIzquierdo = false;
        break;
      case 'exterior_1':
        this.isLoadingExterior1 = false;
        break;
      case 'exterior_2':
        this.isLoadingExterior2 = false;
        break;
      case 'motor':
        this.isLoadingMotor = false;
        break;
      case 'cajuela':
        this.isLoadingCajuela = false;
        break;
      case 'tablero':
        this.isLoadingTablero = false;
        break;
      case 'interior_1':
        this.isLoadingInterior1 = false;
        break;
      case 'interior_2':
        this.isLoadingInterior2 = false;
        break;
      case 'interior_3':
        this.isLoadingInterior3 = false;
        break;
      case 'interior_4':
        this.isLoadingInterior4 = false;
        break;
      case 'interior_5':
        this.isLoadingInterior5 = false;
        break;
      default:
        break;
    }
  }

  setLoadingState(position: string, state: boolean) {
    switch (position) {
      case 'frente': this.isLoadingFrente = state; break;
      case 'atras': this.isLoadingAtras = state; break;
      case 'lateral_derecho': this.isLoadingLateralDerecho = state; break;
      case 'lateral_izquierdo': this.isLoadingLateralIzquierdo = state; break;
      case 'exterior_1': this.isLoadingExterior1 = state; break;
      case 'exterior_2': this.isLoadingExterior2 = state; break;
      case 'motor': this.isLoadingMotor = state; break;
      case 'cajuela': this.isLoadingCajuela = state; break;
      case 'tablero': this.isLoadingTablero = state; break;
      case 'interior_1': this.isLoadingInterior1 = state; break;
      case 'interior_2': this.isLoadingInterior2 = state; break;
      case 'interior_3': this.isLoadingInterior3 = state; break;
      case 'interior_4': this.isLoadingInterior4 = state; break;
      case 'interior_5': this.isLoadingInterior5 = state; break;
      default: break;
    }
  }

  linkHome(validacionId: string) {
    this.router.navigate(['tabs/tab2/inspeccion/' + validacionId]);
  }

}
