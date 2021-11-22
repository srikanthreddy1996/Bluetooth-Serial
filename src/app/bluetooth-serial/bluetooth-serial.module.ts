import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BluetoothSerialPageRoutingModule } from './bluetooth-serial-routing.module';

import { BluetoothSerialPage } from './bluetooth-serial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BluetoothSerialPageRoutingModule
  ],
  declarations: [BluetoothSerialPage]
})
export class BluetoothSerialPageModule {}
