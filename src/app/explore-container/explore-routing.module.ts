import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapOcrComponent } from '../explore-container/cap-ocr/cap-ocr.component';
import { FotosComponent } from '../explore-container/fotos/fotos.component';

const routes: Routes = [

  {path:'ocr', component: CapOcrComponent},
  // {path:'fotos', component: FotosComponent},
  // {path: '**', redirectTo: 'tabs/tab2'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class exploreRoutingModule {}
