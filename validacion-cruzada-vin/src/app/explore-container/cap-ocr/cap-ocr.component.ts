import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasosService } from '../../services/casos.service';
import { Caso } from 'src/app/interfaces/caso.interfaces';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-cap-ocr',
  templateUrl: './cap-ocr.component.html',
  styleUrls: ['./cap-ocr.component.scss'],
})
export class CapOcrComponent  implements OnInit {
  fotoPuerta:boolean = false;
  fotoParabrisas:boolean = false;
  mostrarResutlado:boolean = false;
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
    private firestoreService: FirestoreService
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

  fotoPuertaCapturada(){
    this.fotoPuerta = true;
    this.capturaManualPuerta = false;
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
      vin:this.casoJson.visibles.vin,
    }
    this.firestoreService.updateDoc(data,'validacion','1');
    this.capturaManualPuerta = false;
    console.log('Guardando captura manual puerta');
    }, 1500);
  }

}
