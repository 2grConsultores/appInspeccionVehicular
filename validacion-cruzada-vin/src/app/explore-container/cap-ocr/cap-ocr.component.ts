import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cap-ocr',
  templateUrl: './cap-ocr.component.html',
  styleUrls: ['./cap-ocr.component.scss'],
})
export class CapOcrComponent  implements OnInit {
  mostrarResutlado:boolean = false;
  caso:number = 0; 

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  validarCaptura(){
    setTimeout(() => {
      // Después de 3 segundos, mostrar el resultado
      console.log('Validando captura');
      this.mostrarResutlado = true;
  
    }, 3500);


  }

  linkCapturaOBD(caso: number){
    this.router.navigate(['obd/'+caso]);
  }

}
