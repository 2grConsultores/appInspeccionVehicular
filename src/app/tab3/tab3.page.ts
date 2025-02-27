import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuario: any = {};

  constructor(
    private authService: AuthService,
     private router: Router,
    
  ) {}


  ngOnInit() {
    this.obtenerUsuario();
  }

  obtenerUsuario() {

  }

  cerrarSesion() {
    this.authService.signOut();
    this.router.navigate(['login']);
  }

}
