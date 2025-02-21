import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasosService } from '../../services/casos.service';
import { Caso } from 'src/app/interfaces/caso.interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { PhotoService } from 'src/app/services/photo.service';
import { GoogleCloudVisionService } from '../../services/google-cloud-vision.service';
import { validacionInt } from 'src/app/interfaces/validacion.interfaces';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cap-ocr',
  templateUrl: './cap-ocr.component.html',
  styleUrls: ['./cap-ocr.component.scss'],
})
export class CapOcrComponent implements OnInit {
  fotoPuerta: boolean = false;
  fotoParabrisas: boolean = false;
  mostrarResutlado: boolean = false;
  vinOCR: string = '';
  vinImageBase64: string = '';
  validacionId: string = '';
  isAlertOpen = false;
  isAlertOpenInputs = false;
  posicion: string = '';
  mensajeAlert: string = '';
  vinREGEX = /[a-hj-npr-zA-HJ-NPR-Z0-9]{17}/g;
  mostrarTablaComparacion: boolean = false;
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
            base64: '',
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
          base64: '',
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
  };

  // resultados
  mostrarVinPuerta: boolean = false;
  resultadoVinPuerta: string = '';
  mostrarVinParabrisas: boolean = false;
  resultadoVinParabrisas: string = '';
  mostrarVinFactura: boolean = false;
  resultadoVinFactura: string = '';
  mostrarVinTarjeta: boolean = false;
  resultadoVinTarjeta: string = '';

  //Captura de fotos
  capturaParabrisas: boolean = false;
  capturaPuerta: boolean = false;
  capturaFactura: boolean = false;
  capturaTarjetaCirculacion: boolean = false;

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

  // semaforos
  mostrarIcono: boolean = false;
  colorResultado: string = '';
  iconoResultado: string = '';
  arregloResultados: any[] = [];

  casoJson: Caso = {
    _id: 0,
    visibles: {
      listaLecturas: [
        {
          lectura: '',
          resultado: '',
        },
      ],
      vin: '',
    },
    obd: {
      vin: '',
    },
    nfc: {
      vin: '',
    },
    resultado: {
      riesgo: '',
      color: '',
      descripcion: '',
      recomendacion: [],
    },
  };

  alertButtons = [
    {
      text: 'Corregir',
      role: 'cancel',
      handler: () => {
        console.log('vin ocr', this.vinOCR);
        // this.setOpenInputs(true);
        this.presentAlertPrompt();
      },
    },
    {
      text: 'Aprobar',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
        console.log('vin ocr', this.vinOCR);
        console.log('posicion', this.posicion);
        this.guardarValidoOCR(this.posicion, this.vinOCR);
        this.comparacionResultados();
      },
    },
  ];

  constructor(
    private router: Router,
    private CasosService: CasosService,
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private photoService: PhotoService,
    private GoogleCloudVisionService: GoogleCloudVisionService,
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

  comparacionResultados() {
    // Limpiar el arreglo antes de agregar nuevos VIN
    this.arregloResultados = [];
    // Verificar si "listaLecturas" existe y tiene elementos
    if (this.validacionData.visibles.listaLecturas.length >= 2) {
      // Iterar sobre las lecturas
      let i = 0;
      this.validacionData.visibles.listaLecturas.forEach((lectura) => {
        // Verificar si "vinEditado" existe y tiene valor, en ese caso usarlo, de lo contrario usar "vinOCR"
        const vin = lectura.vinEditado ? lectura.vinEditado : lectura.vinOCR;
        // Agregar el VIN al arreglo
        this.arregloResultados.push(vin);
        i++;
        console.log('vueltas:', i);
      });
    }
    console.log('arregloResultados', this.arregloResultados);

    if (this.validacionData.visibles.listaLecturas.length >= 1) {
      /// si el arreglo tiene 1 elemento muestra tabla
      this.mostrarTablaComparacion = true;
    }

    const uniqueVins = new Set(this.arregloResultados);
    if (this.arregloResultados.length >= 2) {
      // si el arreglo tiene 2 elementos muestra comparacion
      if (uniqueVins.size === 1) {
        this.mostrarIcono = true;
        this.colorResultado = 'verde';
        this.iconoResultado = 'checkmark';
      } else {
        this.mostrarIcono = true;
        this.colorResultado = 'rojo';
        this.iconoResultado = 'close-outline';
      }
    }
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Ingrese VIN',
      inputs: [
        {
          name: 'vin',
          type: 'text',
          value: this.vinOCR,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Guardar',
          handler: (data) => {
            console.log('vin ingresado:', data.vin);
            this.guardarEdicionVIN(this.posicion, data.vin);
            this.comparacionResultados();
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertPromptVinInvalido() {
    const alert = await this.alertController.create({
      header: 'Vin invalido',
      buttons: [
        {
          text: 'Reintentar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
      ],
    });
    await alert.present();
  }

  validarCaptura() {
    setTimeout(() => {
      // Después de 3 segundos, mostrar el resultado
      console.log('Validando captura');
      this.mostrarResutlado = true;
    }, 3500);
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  setOpenInputs(isOpen: boolean) {
    console.log('setOpenInputs', isOpen);
    this.isAlertOpenInputs = isOpen;
  }

  async capturaOCR(posicion: string) {
    await this.photoService.takePhoto().then((base64Image: any) => {
      console.log('base64Image', base64Image);
      this.vinImageBase64 = base64Image;
      const loading = this.showLoading();
      this.GoogleCloudVisionService.getLabels(
        base64Image,
        'TEXT_DETECTION'
      ).subscribe((result: any) => {
        // console.log('result',result);
        loading.then((loading) => loading.dismiss());
        const vin = result.responses[0].textAnnotations[0].description;
        const matchesVinRegExp: any = vin.match(this.vinREGEX);
        // console.log('matchesVinRegExp',matchesVinRegExp); // matchesVinRegExp is an array
        // const esValido = this.vinREGEX.test(vin);
        if (matchesVinRegExp !== null) {
          console.log('vin valido:', vin);
          this.vinOCR = matchesVinRegExp[0];
          this.arregloResultados.push(this.vinOCR);
          this.mensajeAlert = matchesVinRegExp[0];
          this.posicion = posicion;
          if (posicion == 'puerta') {
            this.capturaPuerta = true;
          } else if (posicion == 'parabrisas') {
            this.capturaParabrisas = true;
          } else if (posicion == 'factura') {
            this.capturaFactura = true;
          } else if (posicion == 'tarjeta-circulacion') {
            this.capturaTarjetaCirculacion = true;
          }
          console.log('posicion:', this.posicion);
          this.setOpen(true);
        } else {
          console.log('vin invalido');
          this.presentAlertPromptVinInvalido();
        }
      });
    });
  }

  async agregaFoto(posicion: string) {
    await this.photoService.takePhoto().then((base64Image: any) => {
      console.log('base64Image', base64Image);
      this.vinImageBase64 = base64Image;
      this.posicion = posicion;
      switch (posicion) {
        case 'frente':
          this.capturaFrente = true;
          break;
        case 'atras':
          this.capturaAtras = true;
          break;
        case 'lado-izquierdo':
          this.capturaLadoIzquierdo = true;
          break;
        case 'lado-derecho':
          this.capturaLadoDerecho = true;
          break;
        case 'exterior1':
          this.capturaExterior1 = true;
          break;
        case 'exterior2':
          this.capturaExterior2 = true;
          break;
        case 'motor':
          this.capturaMotor = true;
          break;
        case 'cajuela':
          this.capturaCajuela = true;
          break;
        case 'tablero':
          this.capturaTablero = true;
          break;
        case 'interior1':
          this.capturaInterior1 = true;
          break;
        case 'interior2':
          this.capturaInterior2 = true;
          break;
        case 'interior3':
          this.capturaInterior3 = true;
          break;
        case 'interior4':
          this.capturaInterior4 = true;
          break;
        case 'interior5':
          this.capturaInterior5 = true;
          break;
        default:
          break;
      }
    });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando VIN...',
    });
    loading.present();
    return loading;
  }

  linkCapturaOBD(validacionId: string) {
    this.router.navigate(['obd/' + validacionId]);
  }

  linkHome(validacionId: string) {
    this.router.navigate(['home']);
  }

  obtenerDatosValidacion(validacionId: string) {
    this.firestoreService
      .findOne('inspecciones', validacionId)
      .subscribe((validacion: validacionInt) => {
        console.log('validacion Datos:', validacion);
        this.validacionData = validacion;
      });
  }

  guardarValidoOCR(posision: string, vinOCR: string) {
    const busquedaanteriores =
      this.validacionData.visibles.listaLecturas.filter(
        (lectura) => lectura.posicion == posision
      );
    console.log('busquedaanteriores', busquedaanteriores);

    if (busquedaanteriores.length >= 1) {
      // si ya existe una lectura en la posicion, la elimina
      console.log('ya existe');
      const indiceExistente =
        this.validacionData.visibles.listaLecturas.indexOf(
          busquedaanteriores[0]
        );
      if (indiceExistente !== -1) {
        this.validacionData.visibles.listaLecturas.splice(indiceExistente, 1);
      }
    }

    const nuevaLectura = {
      posicion: posision,
      vinOCR: vinOCR,
      vinEditado: '',
      editado: false,
      fecha: new Date(),
      imagen: {
        base64: this.vinImageBase64,
      },
    };

    this.validacionData.visibles.listaLecturas.push(nuevaLectura);

    this.firestoreService.updateDoc(
      this.validacionData,
      'inspecciones',
      this.validacionId
    );

    // Actualizar las variables de resultado y mostrar según la posición
    if (posision == 'puerta') {
      this.mostrarVinPuerta = true;
      this.resultadoVinPuerta = vinOCR;
    } else if (posision == 'parabrisas') {
      this.mostrarVinParabrisas = true;
      this.resultadoVinParabrisas = vinOCR;
    } else if (posision == 'factura') {
      this.mostrarVinFactura = true;
      this.resultadoVinFactura = vinOCR;
    } else if (posision == 'tarjeta-circulacion') {
      this.mostrarVinTarjeta = true;
      this.resultadoVinTarjeta = vinOCR;
    }
    console.log('Guardado aprobo OCR');
  }

  guardarEdicionVIN(posision: string, vinEditado: string) {
    const busquedaanteriores =
      this.validacionData.visibles.listaLecturas.filter(
        (lectura) => lectura.posicion == posision
      );
    console.log('busquedaanteriores', busquedaanteriores);

    if (busquedaanteriores.length >= 1) {
      // si ya existe una lectura en la posicion, la elimina
      console.log('ya existe');
      const indiceExistente =
        this.validacionData.visibles.listaLecturas.indexOf(
          busquedaanteriores[0]
        );
      if (indiceExistente !== -1) {
        this.validacionData.visibles.listaLecturas.splice(indiceExistente, 1);
      }
    }

    const nuevaLectura = {
      posicion: posision,
      vinOCR: this.vinOCR,
      vinEditado: vinEditado,
      editado: true,
      fecha: new Date(),
      imagen: {
        base64: this.vinImageBase64,
      },
    };

    this.validacionData.visibles.listaLecturas.push(nuevaLectura);

    this.firestoreService.updateDoc(
      this.validacionData,
      'inspecciones',
      this.validacionId
    );

    if (posision == 'puerta') {
      this.mostrarVinPuerta = true;
      this.resultadoVinPuerta = vinEditado;
    } else if (posision == 'parabrisas') {
      this.mostrarVinParabrisas = true;
      this.resultadoVinParabrisas = vinEditado;
    } else if (posision == 'factura') {
      this.mostrarVinFactura = true;
      this.resultadoVinFactura = vinEditado;
    } else if (posision == 'tarjeta-circulacion') {
      this.mostrarVinTarjeta = true;
      this.resultadoVinTarjeta = vinEditado;
    }
    console.log('Guardado Edito VIN');
  }
}
