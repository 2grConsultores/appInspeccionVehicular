import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public username: string = '';
  public password: string = '';

  constructor(
    private AuthService: AuthService,
    private router: Router,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    console.log('Arranque login:');
  }

  login() {
    this.AuthService.signIn(this.username, this.password).subscribe({
      next: (user) => {
      // Almacena el uid en localStorage para luego identificar al usuario en las inspecciones
      const uid = user.user.uid;
      const email = user.user.email;
      const displayName = user.user.displayName;
      console.log('uid:', uid);
      localStorage.setItem('uid', uid);
      if (email) {
        localStorage.setItem('email', email);
      }
      if (displayName){
        localStorage.setItem('displayName', displayName);
      }
      

        console.log('iciono de sesion correcto:', user);
        this.router.navigate(['/tabs/tab2']);
      },
      error: (err) => {
        console.log('error:', JSON.stringify(err));
        const alert = this.alertController.create({
          header: 'Error',
          message: 'El nombre de usuario o la contraseña son incorrectos',
          buttons: ['OK']
        });
        alert.then((alert) => {
          alert.present();
        });
      }
    });
  }


  loginGoogle() {
    this.AuthService.signInWithGoogle().subscribe({
      next: (user) => {
      // Almacena el uid en localStorage para luego identificar al usuario en las inspecciones
      const uid = user.user.uid;
      console.log('uid:', uid);
      localStorage.setItem('uid', uid);
        console.log('iciono de sesion correcto', user);
        this.router.navigate(['/tabs/tab2']);
      },
      error: (err) => {
        console.log('error:', JSON.stringify(err));
        const alert = this.alertController.create({
          header: 'Error',
          message: 'El incio de sesión con Google ha fallado',
          buttons: ['OK']
        });
        alert.then((alert) => {
          alert.present();
        });
      }
    });
  }

}
