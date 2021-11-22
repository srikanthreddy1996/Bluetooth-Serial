import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BluetoothSerialPage } from './bluetooth-serial.page';

const routes: Routes = [
  {
    path: '',
    component: BluetoothSerialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BluetoothSerialPageRoutingModule {}
