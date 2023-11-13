import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasosService } from '../../services/casos.service';
import { Caso } from 'src/app/interfaces/caso.interfaces';

@Component({
  selector: 'app-cap-nfc',
  templateUrl: './cap-nfc.component.html',
  styleUrls: ['./cap-nfc.component.scss'],
})
export class CapNfcComponent  implements OnInit {

  instrucciones:boolean = true;
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
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe( ({id}) => { // aqui obtengo el id del registro
      this.obtenercasos(id);
      this.caso = id;
    })
  }

  validarCaptura(){
    setTimeout(() => {
      console.log('Validando captura');
      this.mostrarResutlado = true;
  
    }, 3500);
  }

  linkResultado(caso: number){
    this.router.navigate(['resultado/'+caso]);
  }

  buscarDispositivo(){
    setTimeout(() => {
      this.instrucciones = false;
      this.mostrarResutlado = true;
    }, 1600);
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
}
