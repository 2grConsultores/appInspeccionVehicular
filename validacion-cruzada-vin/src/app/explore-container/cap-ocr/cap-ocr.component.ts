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
export class CapOcrComponent  implements OnInit {
  fotoPuerta:boolean = false;
  fotoParabrisas:boolean = false;
  mostrarResutlado:boolean = false;
  vinOCR:string = '';
  vinImageBase64:string = '';
  validacionId:string = ''; 
  isAlertOpen = false;
  isAlertOpenInputs = false;
  posicion:string = '';
  mensajeAlert:string = '';
  vinREGEX = /[a-hj-npr-zA-HJ-NPR-Z0-9]{17}/g;
  mostrarTablaComparacion:boolean = false;


// resultados
  mostrarVinPuerta:boolean = false;
  resultadoVinPuerta:string = '';
  mostrarVinParabrisas:boolean = false;
  resultadoVinParabrisas:string = '';
  mostrarVinFactura:boolean = false;
  resultadoVinFactura:string = '';
  mostrarVinTarjeta:boolean = false;
  resultadoVinTarjeta:string = '';


  //Captura de fotos
capturaParabrisas:boolean = false;
capturaPuerta:boolean = false;
capturaFactura:boolean = false;
capturaTarjetaCirculacion:boolean = false;

// semaforos 
mostrarIcono:boolean = false;
colorResultado:string = '';
iconoResultado:string = '';
arregloResultados:string[] = [];

  casoJson:Caso = {
    _id: 0,
    visibles: {
      listaLecturas: [{
        lectura:'',
        resultado:''
      }],
      vin: ''
    },
    obd: {
      vin: ''
    },
    nfc: {
      vin: ''
    },
    resultado: {
      riesgo: '',
      color: '',
      descripcion: '',
      recomendacion: []
    }
  };

  alertButtons = [
    {
      text: 'Corregir',
      role: 'cancel',
      handler: () => {
        console.log('vin ocr',this.vinOCR);
        // this.setOpenInputs(true);
        this.presentAlertPrompt();
      },
    },
    {
      text: 'Aprobar',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
        console.log('vin ocr',this.vinOCR);
        console.log('posicion',this.posicion);
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

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe( ({id}) => { // aqui obtengo el id del registro
      // this.obtenercasos(id);
      this.validacionId = id;
    })
  }

  comparacionResultados(){
    console.log('Comparacion',this.arregloResultados);
    if (this.arregloResultados.length >= 1) { /// si el arreglo tiene 1 elemento muetra tabla
      this.mostrarTablaComparacion = true;
    }
    const uniqueVins = new Set(this.arregloResultados);
    if(this.arregloResultados.length >= 2){ // si el arreglo tiene 2 elementos muestra comparacion
      if (uniqueVins.size === 1) {
        this.mostrarIcono = true;
        this.colorResultado = 'verde';
        this.iconoResultado = 'checkmark-circle';
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
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            console.log('vin ingresado:', data.vin);
            this.guardarEdicionVIN(this.posicion, data.vin );
          }
        }
      ]
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
          }
        },
      ]
    });
    await alert.present();
  }

  validarCaptura(){
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
    console.log('setOpenInputs',isOpen);
    this.isAlertOpenInputs = isOpen;
  }

  async capturaOCR(posicion: string){
    await this.photoService.takePhoto().then( (base64Image: any) => {
      console.log('base64Image',base64Image);
      this.vinImageBase64 = base64Image;
      const loading = this.showLoading();
      this.GoogleCloudVisionService.getLabels(base64Image, 'TEXT_DETECTION').subscribe((result: any) => {
        // console.log('result',result);
        loading.then(loading => loading.dismiss());
        const vin = result.responses[0].textAnnotations[0].description;
        const matchesVinRegExp: any = vin.match(this.vinREGEX);
        // console.log('matchesVinRegExp',matchesVinRegExp); // matchesVinRegExp is an array
        // const esValido = this.vinREGEX.test(vin);
        if (matchesVinRegExp !== null){
          console.log('vin valido:', vin);
          this.vinOCR = matchesVinRegExp[0];
          this.arregloResultados.push(this.vinOCR);
          this.mensajeAlert = matchesVinRegExp[0];
          this.posicion = posicion;
          if(posicion == 'puerta'){
            this.capturaPuerta = true;
          } else if (posicion == 'parabrisas'){
            this.capturaParabrisas = true;
          } else if (posicion == 'factura'){
            this.capturaFactura = true;
          } else if (posicion == 'tarjeta-circulacion'){
            this.capturaTarjetaCirculacion = true;
          }
          console.log('posicion:',this.posicion);
          this.setOpen(true);
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

  linkCapturaOBD(validacionId: string){
    this.router.navigate(['obd/'+validacionId]);
  }

  linkHome(validacionId: string){
    this.router.navigate(['home']);
  }

  
  // fotoParabrisasCapturada(){
  //   this.capturaManualParabrisas = false;
  //   this.fotoParabrisas = true;
  // }


  // obtenercasos(numeroCaso: number){
  //   console.log('numero de caso',numeroCaso);
  //   this.CasosService.getJSON().subscribe( (casos: Caso[]) => {
  //     console.log('casos',casos);
  //     const foundCaso = casos.find( (caso: Caso) => caso._id == numeroCaso);
  //     if (foundCaso !== undefined) {
  //       this.casoJson = foundCaso; // if foundCaso is not undefined, assign it to this.casoJson
  //       console.log('casoJson',this.casoJson);
  //     } else {
  //       console.log('No se encontro el caso');
  //     }
  //   });
  // }

  guardarValidoOCR( posision: string, vinOCR: string){
    const data = {
      visibles: {
        listaLecturas: [{
          posicion: posision,
          vinOCR: vinOCR,
          vinEditado: '',
          editado: false,
          fecha: new Date(),
          imagen: {
            base64: this.vinImageBase64,
          },
        }],
        vin: vinOCR,
      },
    };

    this.firestoreService.updateDoc(data,'validacion',this.validacionId);
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

  guardarEdicionVIN(posision: string, vinEditado: string ){
    const data = {
      visibles: {
        listaLecturas: [{
          posicion: posision,
          vinOCR: this.vinOCR,
          vinEditado: vinEditado,
          editado: true,
          fecha: new Date(),
          imagen: {
            base64: this.vinImageBase64,
          },
        }],
        vin: vinEditado,
      },
    };
    this.firestoreService.updateDoc(data,'validacion',this.validacionId);
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
