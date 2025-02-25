import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore, FirestoreModule } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp({
      projectId: "comprasegura-c5113",
      appId: "1:438286891161:web:848cbaa0a1fe3bfb462008",
      storageBucket: "comprasegura-c5113.firebasestorage.app",
      apiKey: "AIzaSyDwwl7HQRV2srXun9cvGP4tU12gjSrM3xw",
      authDomain: "comprasegura-c5113.firebaseapp.com",
      messagingSenderId: "438286891161",
      measurementId: "G-29YNLWXZMD"
    })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    FirestoreModule,
    // provideFirebaseApp(() => initializeApp({
    // "projectId":"comprasegura-c5113",
    // "appId":"1:438286891161:web:848cbaa0a1fe3bfb462008",
    // "storageBucket":"comprasegura-c5113.firebasestorage.app",
    // "apiKey":"AIzaSyDwwl7HQRV2srXun9cvGP4tU12gjSrM3xw",
    // "authDomain":"comprasegura-c5113.firebaseapp.com",
    // "messagingSenderId":"438286891161",
    // "measurementId":"G-29YNLWXZMD"})),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
