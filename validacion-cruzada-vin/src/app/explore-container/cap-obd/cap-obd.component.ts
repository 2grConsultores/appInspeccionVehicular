import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cap-obd',
  templateUrl: './cap-obd.component.html',
  styleUrls: ['./cap-obd.component.scss'],
})
export class CapObdComponent  implements OnInit {
  mostrarResutlado:boolean = false;
  caso:number = 0; 

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  validarCaptura(){
    setTimeout(() => {
      console.log('Validando captura');
      this.mostrarResutlado = true;
  
    }, 3500);
  }

  linkCapturaNFC(caso: number){
    this.router.navigate(['nfc/'+caso]);
  }

}
