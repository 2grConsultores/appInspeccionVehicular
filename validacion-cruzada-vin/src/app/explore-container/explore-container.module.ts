import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from './explore-container.component';
import { CapOcrComponent } from './cap-ocr/cap-ocr.component';
import { CapNfcComponent } from './cap-nfc/cap-nfc.component';
import { CapObdComponent } from './cap-obd/cap-obd.component';
import { exploreRoutingModule } from './explore-routing.module';

@NgModule({
  imports: [ 
    CommonModule, 
    FormsModule, 
    IonicModule,
    exploreRoutingModule
  ],
  declarations: [
    ExploreContainerComponent,
    CapOcrComponent,
    CapNfcComponent,
    CapObdComponent
  ],
  exports: [ExploreContainerComponent]
})
export class ExploreContainerComponentModule {}
