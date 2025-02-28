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
  uid: string = '';
  email: string = '';
  displayName: string = '';
  constructor(
    private authService: AuthService,
     private router: Router,
    
  ) {}


  ngOnInit() {
    this.obtenerUsuario();
    this.uid = localStorage.getItem('uid') || '';
    this.email = localStorage.getItem('email') || '';
    this.displayName = localStorage.getItem('displayName') || '';
  }

  obtenerUsuario() {

  }

  cerrarSesion() {
    this.authService.signOut();
    this.router.navigate(['login']);
    localStorage.removeItem('uid');
  }

}
