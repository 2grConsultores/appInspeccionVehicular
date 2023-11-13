import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CapOcrComponent } from './explore-container/cap-ocr/cap-ocr.component';
import { CapObdComponent } from './explore-container/cap-obd/cap-obd.component';
import { CapNfcComponent } from './explore-container/cap-nfc/cap-nfc.component';
import { ResultadoComponent } from './explore-container/resultado/resultado.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {path: 'ocr/:id', component: CapOcrComponent},
  {path: 'obd/:id', component: CapObdComponent},
  {path: 'nfc/:id', component: CapNfcComponent},
  {path: 'resultado/:id', component: ResultadoComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
