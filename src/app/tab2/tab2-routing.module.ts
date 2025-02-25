import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { CapOcrComponent } from '../explore-container/cap-ocr/cap-ocr.component';
import { FotosComponent } from '../explore-container/fotos/fotos.component';
import { ResultadoComponent } from '../explore-container/resultado/resultado.component';
import { InspeccionComponent } from '../explore-container/inspeccion/inspeccion.component';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
  },
  {path: 'ocr/:id', component: CapOcrComponent},
  {path: 'fotos/:id', component: FotosComponent},
  {path: 'resultado/:id', component: ResultadoComponent},
  {path: 'inspeccion/:id', component: InspeccionComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
