import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasosService } from '../../services/casos.service';
import { Caso } from 'src/app/interfaces/caso.interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { PhotoService } from 'src/app/services/photo.service';
import { GoogleCloudVisionService } from '../../services/google-cloud-vision.service';

@Component({
  selector: 'app-cap-ocr',
  templateUrl: './cap-ocr.component.html',
  styleUrls: ['./cap-ocr.component.scss'],
})
export class CapOcrComponent  implements OnInit {
  fotoPuerta:boolean = false;
  fotoParabrisas:boolean = false;
  mostrarResutlado:boolean = false;
  vinPuerta:string = '';
  caso:number = 0; 
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

  constructor(
    private router: Router,
    private CasosService: CasosService,
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private photoService: PhotoService,
    private GoogleCloudVisionService: GoogleCloudVisionService

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe( ({id}) => { // aqui obtengo el id del registro
      this.obtenercasos(id);
      this.caso = id;
    })
  }

  validarCaptura(){
    setTimeout(() => {
      // Después de 3 segundos, mostrar el resultado
      console.log('Validando captura');
      this.mostrarResutlado = true;
  
    }, 3500);
  }

  async fotoPuertaCapturada(){
    await this.photoService.takePhoto().then( (base64Image: any) => {
      console.log('base64Image',base64Image);
      this.GoogleCloudVisionService.getLabels(base64Image, 'TEXT_DETECTION').subscribe((result: any) => {
        console.log('result',result);
        const vin = result.responses[0].textAnnotations[0].description;
        console.log('vin',vin);
        this.vinPuerta = vin;
        // const data = {
        //   vin:vin,
        // }
        // this.firestoreService.updateDoc(data,'validacion','1');
        this.fotoPuerta = true;
        this.capturaManualPuerta = true;
      });

    });
  }
  fotoParabrisasCapturada(){
    this.capturaManualParabrisas = false;
    this.fotoParabrisas = true;
  }

  linkCapturaOBD(caso: number){
    this.router.navigate(['obd/'+caso]);
  }

  obtenercasos(numeroCaso: number){
    console.log('numero de caso',numeroCaso);
    this.CasosService.getJSON().subscribe( (casos: Caso[]) => {
      console.log('casos',casos);
      const foundCaso = casos.find( (caso: Caso) => caso._id == numeroCaso);
      if (foundCaso !== undefined) {
        this.casoJson = foundCaso; // if foundCaso is not undefined, assign it to this.casoJson
        console.log('casoJson',this.casoJson);
      } else {
        console.log('No se encontro el caso');
      }
    });
  }

  capturaManualPuerta:boolean = false;
  capManualPuerta(){
    this.capturaManualPuerta = true;
    this.fotoPuerta = false;
  };

  capturaManualParabrisas:boolean = false;
  capManualParabrisas(){
    this.capturaManualParabrisas = true;
    this.fotoParabrisas = false;
  };

  guardarCapManualPuerta(){
    setTimeout(() => {
    const data = {
      vin:this.vinPuerta,
    }
    this.firestoreService.updateDoc(data,'validacion','1');
    this.capturaManualPuerta = false;
    console.log('Guardando captura manual puerta');
    }, 1500);
  }

}
