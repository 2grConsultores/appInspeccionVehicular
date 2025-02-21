import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasosService } from '../../services/casos.service';
import { Caso } from 'src/app/interfaces/caso.interfaces';

@Component({
  selector: 'app-cap-obd',
  templateUrl: './cap-obd.component.html',
  styleUrls: ['./cap-obd.component.scss'],
})
export class CapObdComponent  implements OnInit {
  mostrarResutlado:boolean = false;
  caso:number = 0; 
  instrucciones:boolean = true;
  vincularDispositivo:boolean = false;
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

  linkCapturaNFC(caso: number){
    this.router.navigate(['nfc/'+caso]);
  }

  buscarDispositivo(){
    setTimeout(() => {
      this.vincularDispositivo = true;
      this.instrucciones = false;
    }, 1600);
  }

  obtenerVin(){
    setTimeout(() => {
      this.vincularDispositivo = false;
      this.mostrarResutlado = true;
    }, 3200);
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
