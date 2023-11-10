import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cap-ocr',
  templateUrl: './cap-ocr.component.html',
  styleUrls: ['./cap-ocr.component.scss'],
})
export class CapOcrComponent  implements OnInit {
  mostrarResutlado:boolean = false;

  constructor() { }

  ngOnInit() {}

  validarCaptura(){
    setTimeout(() => {
      // Después de 3 segundos, mostrar el resultado
      this.mostrarResutlado = true;
    }, 3000);
  }

}
