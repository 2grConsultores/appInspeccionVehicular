import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CasosService } from '../../services/casos.service';
import { Caso } from 'src/app/interfaces/caso.interfaces';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
})
export class ResultadoComponent  implements OnInit {

  mostrarResutlado:boolean = true;
  muestraVisibles:boolean = false;
  muestraObd:boolean = false;
  muestraEngomado:boolean = false;
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
    })
  }

  validarCaptura(){
    setTimeout(() => {
      // Después de 3 segundos, mostrar el resultado
      console.log('Validando captura');
      this.mostrarResutlado = true;
  
    }, 3500);


  }

  linkCapturaHome(){
    this.router.navigate(['home']);
  }

  obtenercasos(numeroCaso: number){
    console.log('numero de caso',numeroCaso);
    this.CasosService.getJSON().subscribe( (casos: Caso[]) => {
      console.log('casos',casos);
      const foundCaso = casos.find( (caso: Caso) => caso._id == numeroCaso);
      if (foundCaso !== undefined) {
        this.casoJson = foundCaso; // if foundCaso is not undefined, assign it to this.casoJson
        console.log('casoJson',this.casoJson);
        if(foundCaso.visibles.vin == foundCaso.obd.vin && foundCaso.visibles.vin == foundCaso.nfc.vin){
          this.muestraVisibles = true;
          this.muestraObd = false; 
          this.muestraEngomado = false;}
        else if(foundCaso.visibles.vin == foundCaso.obd.vin && foundCaso.visibles.vin != foundCaso.nfc.vin){
          this.muestraVisibles = true;
          this.muestraObd = false; 
          this.muestraEngomado = true;}
        else if(foundCaso.visibles.vin != foundCaso.obd.vin && foundCaso.visibles.vin == foundCaso.nfc.vin){
          this.muestraVisibles = true;
          this.muestraObd = true; 
          this.muestraEngomado = false;
        }
        else if(foundCaso.visibles.vin != foundCaso.obd.vin && foundCaso.visibles.vin != foundCaso.nfc.vin && foundCaso.obd.vin == foundCaso.nfc.vin){
          this.muestraVisibles = true;
          this.muestraObd = true; 
          this.muestraEngomado = false;
        }
        else if(foundCaso.visibles.vin != foundCaso.obd.vin && foundCaso.visibles.vin != foundCaso.nfc.vin && foundCaso.obd.vin != foundCaso.nfc.vin){
          this.muestraVisibles = true;
          this.muestraObd = true; 
          this.muestraEngomado = true;
        }
        
      } else {
        console.log('No se encontro el caso');
      }
    });
  }

}
