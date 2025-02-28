import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { PhotoService } from 'src/app/services/photo.service';
import { GoogleCloudVisionService } from '../../services/google-cloud-vision.service';
import { NhtsaService } from '../../services/nhtsa.service';
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
  fotoImage_url: string = '';
  validacionId: string = '';
  isAlertOpen = false;
  isAlertOpenInputs = false;
  posicion: string = '';
  mensajeAlert: string = '';
  vinREGEX = /[a-hj-npr-zA-HJ-NPR-Z0-9]{17}/g;

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

  // resultados
  mostrarVinPuerta: boolean = false;
  resultadoVinPuerta: string = '';
  mostrarVinParabrisas: boolean = false;
  resultadoVinParabrisas: string = '';
  mostrarVinFactura: boolean = false;
  resultadoVinFactura: string = '';
  mostrarVinTarjeta: boolean = false;
  resultadoVinTarjeta: string = '';
  mostrarTablaComparacion: boolean = false;


  //Captura de fotos
  capturaParabrisas: boolean = false;
  capturaPuerta: boolean = false;
  capturaFactura: boolean = false;
  capturaTarjetaCirculacion: boolean = false;

  //url de las fotos
  urlParabrisas: string = '../../../assets/botonesVisibles/parabrisas.png';
  urlPuerta: string = '../../../assets/botonesVisibles/puerta.png';
  urlFactura: string = '../../../assets/botonesVisibles/factura.png';
  urlTarjetaCirculacion: string = '../../../assets/botonesVisibles/tarjeta-circulacion.png';

  // semaforos
  mostrarIcono: boolean = false;
  colorResultado: string = '';
  iconoResultado: string = '';
  arregloResultados: any[] = [];

  // Variables para la decodificación del VIN
  public vinDecodificado: boolean = false;
  public consultaNHTSA: any = {};


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
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private photoService: PhotoService,
    private GoogleCloudVisionService: GoogleCloudVisionService,
    private nhtsaService: NhtsaService,
    public alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      // aqui obtengo el id del registro
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
      // Iterar sobre las lecturas y extraer el VIN (usando vinEditado si existe)
      this.validacionData.visibles.listaLecturas.forEach((lectura) => {
        const vin = lectura.vinEditado ? lectura.vinEditado : lectura.vinOCR;
        this.arregloResultados.push(vin);
      });
    }
    console.log('arregloResultados', this.arregloResultados);
  
    // Si hay al menos 1 lectura, se muestra la tabla de comparación
    if (this.validacionData.visibles.listaLecturas.length >= 1) {
      this.mostrarTablaComparacion = true;
    }
  
    const uniqueVins = new Set(this.arregloResultados);
  
    // Si hay al menos 2 lecturas, se muestra la comparación (verde si coinciden, rojo si no)
    if (this.arregloResultados.length >= 2) {
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
  
    // Si se tienen exactamente 4 VIN y todos coinciden, se llama a consultarNHTSA
    if (this.arregloResultados.length === 4 && uniqueVins.size === 1 && this.validacionData.decodificacionVin.completada === false) {
      const vinUnico = this.arregloResultados[0];
      this.consultarNHTSA(vinUnico);
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
    await this.photoService.takePhoto().then((image: any) => {
      console.log('imagen', image);
      // this.vinImageBase64 = base64Image;
      const loading = this.showLoading();
      this.GoogleCloudVisionService.getLabels(
        image.base64String,
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
          switch (posicion) {
            case 'puerta':
              this.capturaPuerta = true;
              break;
            case 'parabrisas':
              this.capturaParabrisas = true;
              break;
            case 'factura':
              this.capturaFactura = true;
              break;
            case 'tarjeta-circulacion':
              this.capturaTarjetaCirculacion = true;
              break;
            default:
              break;
          }
          // console.log('posicion:', this.posicion);
          this.setOpen(true);
          // requiero una funcion donde guarde la foto en firbse storage ya que hizo la lectura del vin y guarde la url de la foto en la base de datos
          console.log('imagen', image);
          const path = 'ocr/'+posicion;
          const blob = this.photoService.base64toBlob(image.base64String, 'image/jpeg');
          console.log('upload - variables',blob, image, path);
          this.photoService.uploadImage(blob,image,path).then((url) => {
            console.log('url-componente', url);
            this.fotoImage_url = url;
            switch (posicion) {
              case 'puerta':
                this.urlPuerta = url;
                break;
              case 'parabrisas':
                this.urlParabrisas = url;
                break;
              case 'factura':
                this.urlFactura = url;
                break;
              case 'tarjeta-circulacion':
                this.urlTarjetaCirculacion = url;
                break;
              default:
                break;
            }
          });
        } else {
          console.log('vin invalido');
          this.presentAlertPromptVinInvalido();
        }
      });

    });
  }



  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando VIN...',
    });
    loading.present();
    return loading;
  }

  linkCapturaFotos(validacionId: string) {
    this.router.navigate(['tabs/tab2/fotos/' + validacionId]);
  }

  linkHome(validacionId: string) {
    this.router.navigate(['tabs/tab2/inspeccion/' + validacionId]);
  }

  obtenerDatosValidacion(validacionId: string) {
    this.firestoreService
      .findOne('inspecciones', validacionId)
      .subscribe((validacion: validacionInt) => {
        console.log('validacion Datos:', validacion);
        this.validacionData = validacion;
        if (this.validacionData.visibles.listaLecturas.length >= 1) {
          this.validacionData.visibles.listaLecturas.forEach((lectura) => {

            if (lectura.posicion == 'puerta') {
              this.mostrarVinPuerta = true;
              this.resultadoVinPuerta = lectura.vinEditado
                ? lectura.vinEditado
                : lectura.vinOCR;
              this.urlPuerta = lectura.imagen.url;
            } else if (lectura.posicion == 'parabrisas') {
              this.mostrarVinParabrisas = true;
              this.resultadoVinParabrisas = lectura.vinEditado
                ? lectura.vinEditado
                : lectura.vinOCR;
              this.urlParabrisas = lectura.imagen.url;
            } else if (lectura.posicion == 'factura') {
              this.mostrarVinFactura = true;
              this.resultadoVinFactura = lectura.vinEditado
                ? lectura.vinEditado
                : lectura.vinOCR;
              this.urlFactura = lectura.imagen.url;
            } else if (lectura.posicion == 'tarjeta-circulacion') {
              this.mostrarVinTarjeta = true;
              this.resultadoVinTarjeta = lectura.vinEditado
                ? lectura.vinEditado
                : lectura.vinOCR;
              this.urlTarjetaCirculacion = lectura.imagen.url;
            }
            this.comparacionResultados();
          });
        }

        if (
          this.validacionData.decodificacionVin &&
          this.validacionData.decodificacionVin.completada
        ) {
          this.vinDecodificado = true;
          this.consultaNHTSA = this.validacionData.decodificacionVin;
          this.mostrarTablaComparacion = true; 
        }
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
        url: this.fotoImage_url,
      },
    };

    this.validacionData.visibles.listaLecturas.push(nuevaLectura);

    console.log('validacionData-guardarValidoOCR:', this.validacionData);

    this.firestoreService.updateDoc(
      JSON.parse(JSON.stringify(this.validacionData)),
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
    // console.log('Guardado aprobo OCR');
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
        url: this.fotoImage_url,
      },
    };

    this.validacionData.visibles.listaLecturas.push(nuevaLectura);

    this.firestoreService.updateDoc(
      JSON.parse(JSON.stringify(this.validacionData)),
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

  consultarNHTSA(vin: string) {
    this.nhtsaService
      .getLabels(vin)
      .then((infoVin) => {
        console.log('Información del VIN:', infoVin);
        this.consultaNHTSA = infoVin;
        this.vinDecodificado = true;
        this.validacionData.decodificacionVin = this.consultaNHTSA;
        console.log('validacionData nhtsa', this.validacionData);
        this.firestoreService.updateDoc(
              this.validacionData,
              'inspecciones',
              this.validacionId
            ).then(() => {
              console.log('Decodificación VIN guardada');
            });
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }


}
