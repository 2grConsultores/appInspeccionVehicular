import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CapOcrComponent } from './explore-container/cap-ocr/cap-ocr.component';
import { CapObdComponent } from './explore-container/cap-obd/cap-obd.component';
// import { CapNfcComponent } from './explore-container/cap-nfc/cap-nfc.component';
import { ResultadoComponent } from './explore-container/resultado/resultado.component';
import { FotosComponent } from './explore-container/fotos/fotos.component';

const routes: Routes = [
  // {
  //   path: '', // requiero que la página de inicio sea el login
  //   loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  // },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {path: 'ocr/:id', component: CapOcrComponent},
  // {path: 'fotos/:id', component: FotosComponent},
  // {path: 'obd/:id', component: CapObdComponent},
  // // {path: 'nfc/:id', component: CapNfcComponent},
  // {path: 'resultado/:id', component: ResultadoComponent}
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
