import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapOcrComponent } from '../explore-container/cap-ocr/cap-ocr.component';

const routes: Routes = [

  {path:'ocr/:numero', component: CapOcrComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class exploreRoutingModule {}
