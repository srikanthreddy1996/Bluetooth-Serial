import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {

  private bluetoothState: boolean;
  private initializeStatus: boolean;
  private pairedDevices:any = [];
  private unPairedDevices = [];
  private bluetoothAdapterInfo: any;

  private onOffCallTime = 0;

  constructor(
    public router: Router,
    public androidPermissions: AndroidPermissions,
    public toastController: ToastController,
    public alertController: AlertController,
    public bluetoothle: BluetoothLE, public plt: Platform
  ) {
  }

  async presentToast(message, duration = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  async presentAlert(header = '', subHeader = '', message = '', buttons = []) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons
    });
    alert.present();
  }
  ngOnInit() {
    this.plt.ready().then((readySource) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BluetoothLE).then(
        // result => this.presentToast('Has BluetoothLE permission: ' + result.hasPermission, 100),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BluetoothLE)
      );
      
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
        // result => this.presentToast('Has BLUETOOTH_ADMIN permission: ' + result.hasPermission, 200),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN)
      );
      (async () => {
        this.isBluetoothEnabled();
        this.initializePeripheral();
        this.isInitialized(true);
      })();
    });
  }

  private isInitialized(intialize = false) {
    this.bluetoothle.isInitialized().then((initializeResult) => {
      if (initializeResult.isInitialized==false) {
        this.initializeStatus = false; 
        this.bluetoothState = false;
        if (intialize==true) {
          // this.presentToast('Initializing',300);
          (async () => {
            // Do something before delay
            await new Promise(f => setTimeout(f, 300));
            // Do something after
          })();
          this.initialize();
        }
      }else{
        this.initializeStatus = true;
        this.bluetoothState = true;
        this.bluetoothAdapterInfo = this.bluetoothle.getAdapterInfo();
        this.fetchPairedDevices();
        this.fetchUnPairedDevices();
      }
    });
  }

  private initialize() {
    let params: object = {
      "request": true,
      "statusReceiver": false,
      "restoreKey": "bluetoothleplugin"
    };
    this.bluetoothle.initialize(params).pipe().subscribe((initializeResult) => {
      this.initializeStatus = true;
      if (initializeResult.status == 'disabled') {
        this.bluetoothState = false;
        this.initialize();
      }
      if (initializeResult.status == 'enabled') {
        this.bluetoothState = true;
        this.bluetoothAdapterInfo = this.bluetoothle.getAdapterInfo();
        this.fetchPairedDevices();
        this.fetchUnPairedDevices();
      }
    });
  }

  
  private initializePeripheral() {
    let params: object = {
      "request": true,
      "restoreKey": "bluetoothleplugin"
    };
    this.bluetoothle.initializePeripheral(params).pipe().subscribe(() => {
      this.isInitialized(true);
    });
  }
  private isBluetoothEnabled() {
    this.bluetoothle.isEnabled().then((success) => {
      this.bluetoothState = success.isEnabled;
      if(success.isEnabled==false){
        this.initialize();
      }
    });
  }

  // private enableBluetooth() {
  //   this.bluetoothle.enable();
  // }

  // private disableBluetooth() {
  //   this.bluetoothle.disable();
  // }

  // private changeBluetoothState() {
  //   this.isBluetoothEnabled();
  //   if (this.onOffCallTime == 0) {
  //     try {
  //       if (!this.bluetoothState) {
  //         this.enableBluetooth();
  //       } else {
  //         this.disableBluetooth();
  //       }
  //       this.isBluetoothEnabled();
  //     } catch (error) {
  //       console.error(error);
  //       this.presentAlert(error);
  //     }
  //   } else {
  //     this.presentAlert('Please wait for 5 seconds to On/Off Bluetooth');
  //     this.onOffCallTime = 5000;
  //     setTimeout(() => {
  //       this.onOffCallTime = 0;
  //       this.changeBluetoothState();
  //     }, 2000);
  //   }
  // }

  private fetchPairedDevices(){
    this.isBluetoothEnabled();
    this.bluetoothle.retrieveConnected().then((pairedDevices)=>{
      this.pairedDevices = pairedDevices;
    })
  }

  private fetchUnPairedDevices(){
    this.isBluetoothEnabled();
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      // result => this.presentToast('Has ACCESS_COARSE_LOCATION permission: ' + result.hasPermission, 200),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    );
    this.bluetoothle.isLocationEnabled().then((permission)=>{
      if(!permission.isLocationEnabled){
        this.bluetoothle.requestLocation();
      }
    });
    this.bluetoothle.startScan({isConnectable:true}).pipe().subscribe((onFullfilled)=>{
      this.presentAlert(JSON.stringify(onFullfilled));
    });
    setTimeout(() => {
      this.bluetoothle.stopScan();
      this.presentAlert('Scan ended');
      // this.bluetoothle.discoverUnpaired({aclearCache:true})
    }, 10000);
  }

  private getConnectedDevice(){
    for(let i=0;i<this.pairedDevices.length;i++){
      if(this.pairedDevices[i].isConnected==true){
        return i;
      }
    }
    return false;
  }

  private connect(index){
    let alreadyConnectedDeviceIndex = this.getConnectedDevice();
    if(alreadyConnectedDeviceIndex!==false){
      if(this.pairedDevices[index].address==this.pairedDevices[alreadyConnectedDeviceIndex].address){
        return true;
      }else{
        this.disConnect(alreadyConnectedDeviceIndex);
      }
    }
    let params = {address:this.pairedDevices[index].address,autoConnect:true};
    this.bluetoothle.connect(params).pipe().subscribe(()=>{
      this.presentToast('Connect Request:'+index,3000);
      this.bluetoothle.isConnected({address:this.pairedDevices[index].address}).then((connection)=>{
        this.pairedDevices[index]['isConnected']=connection.isConnected;
      });
    });
  }

  private disConnect(index){
    let params = {address:this.pairedDevices[index].address};
    this.bluetoothle.disconnect(params).then((status)=>{
      this.pairedDevices[index].isConnected = false;
    })
  }
}
