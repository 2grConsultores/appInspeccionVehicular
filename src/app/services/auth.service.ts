import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  // Iniciar sesión con email y contraseña
  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Iniciar sesión con Google
  signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  // Cerrar sesión
  signOut(): Observable<void> {
    console.log('signOut');
    return from(signOut(this.auth));
  }

  // Verificar si hay un usuario autenticado
  isLoggedIn(): boolean {
    // Devuelve true si existe un usuario actual en Auth
    return this.auth.currentUser !== null;
  }
}
