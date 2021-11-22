import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-bluetooth-serial',
  templateUrl: './bluetooth-serial.page.html',
  styleUrls: ['./bluetooth-serial.page.scss'],
})
export class BluetoothSerialPage implements OnInit {

  constructor(
    public router: Router,
    public androidPermissions: AndroidPermissions,
    public bluetoothSerial: BluetoothSerial,
    public toastController: ToastController,
    public alertController: AlertController,
    public plt: Platform,
    // public localNotifications:LocalNotifications
  ) { }

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

  private enabled: boolean = false;
  private isConnected: boolean = false;
  private pairedDevices: any = [];
  private unPairedDevices: any = [];
  private connectedDevice;
  private buffer = '';
  public writeData = '';
  private dataSent = '';

  ngOnInit() {
    this.plt.ready().then((readySource) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BluetoothLE).then(
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BluetoothLE)
      );
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN)
      );
    });
  }

  private go() {
    this.router.navigateByUrl('bluetooth');
  }
  ionViewDidEnter() {
    this.checktillConnectStatus();
    this.subscribeToData();
  }

  private checktillConnectStatus() {
    this.bluetoothSerial.isEnabled().then(
      enable => {
        this.enabled = true;
        this.fetchPairedDevices();
        this.fetchUnPairedDevices();
        // this.openSettingsIfNotConnected();
      }, disable => {
        this.enabled = false;
        this.enableBluetooth(true);
      }
    );
  }

  private enableBluetooth(fetch = false) {
    this.bluetoothSerial.enable().then(
      enable => {
        this.enabled = true;
        if (fetch) {
          this.fetchPairedDevices();
          this.fetchUnPairedDevices();
        }
        this.openSettingsIfNotConnected();
      },
      notEnable => {
        this.enabled = false;
        this.presentAlert('Error Turning on bluetooth');
      }
    )
  }

  private openSettingsIfNotConnected() {
    this.bluetoothSerial.isConnected().then(connection => {
      this.subscribeToData();
      this.availableData();
    },
      noConnection => {
        this.openSettings();
      });
  }



  private openSettings() {
    this.bluetoothSerial.showBluetoothSettings();
  }

  private checkIsConnected() {
    this.bluetoothSerial.isConnected().then(
      connection => {
        // this.presentAlert('IsConnected: ' + JSON.stringify(connection));
        this.isConnected = false;
        for (let i = 0; i < this.pairedDevices.length; i++) {
          if (this.connectedDevice && this.pairedDevices[i].address == this.connectedDevice.address) {
            // if (!this.pairedDevices[i]['isConnected']) {
            // this.connectPairedDeviceInSecure(i);
            this.isConnected = true;
            this.pairedDevices[i]['isConnected'] = true;
            // }
          } else {
            this.pairedDevices[i]['isConnected'] = false;
          }
        }
      },
      noConnection => {
        for (let i = 0; i < this.pairedDevices.length; i++) {
          this.pairedDevices[i]['isConnected'] = false;
        }
        this.connectedDevice = false;
        this.isConnected = false;
      }
    );
  }

  private fetchPairedDevices() {
    this.bluetoothSerial.list().then((devices) => {
      this.pairedDevices = devices;
      this.checkIsConnected();
    });
  }

  private fetchUnPairedDevices() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      // result => this.presentToast('Has ACCESS_COARSE_LOCATION permission: ' + result.hasPermission, 200),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.LOCATION).then(
      // result => this.presentToast('Has ACCESS_COARSE_LOCATION permission: ' + result.hasPermission, 200),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.LOCATION)
    );
    this.bluetoothSerial.discoverUnpaired().then(
      devices => {
        this.unPairedDevices = devices;
      },
      error => {
        this.presentAlert(error);
      }
    );
    this.bluetoothSerial.setDeviceDiscoveredListener().pipe().subscribe(device => {
      // this.unPairedDevices.push(device);
      this.presentAlert(JSON.stringify('pipe' + device));
    });
    this.bluetoothSerial.setDeviceDiscoveredListener().subscribe(device => {
      // this.unPairedDevices.push(device);
      this.presentAlert(JSON.stringify('no pipe' + device));
    });
  }

  private connectPairedDevice(i) {
    if (this.pairedDevices[i]['isConnected'] == true) {
      return false;
    }
    let mac_address_or_uuid = this.pairedDevices[i].address;
    this.bluetoothSerial.connect(mac_address_or_uuid)
      .subscribe(connect => {
        this.presentToast('Connected Secure' + JSON.stringify(connect), 3000);
        this.makeDeviceConnected(i);
        this.connectPairedDevice(i);
      }, error => {
        this.presentToast('Error Connecting Device' + JSON.stringify(error), 300);
        this.isConnected = false;
      });
  }
  private connectPairedDeviceInSecure(i) {
    if (this.pairedDevices[i]['isConnected'] == true) {
      return false;
    }
    let mac_address_or_uuid = this.pairedDevices[i].address;
    this.bluetoothSerial.connectInsecure(mac_address_or_uuid).subscribe(connect => {
      this.presentToast('Connected Insecure' + JSON.stringify(connect), 3000);
      this.makeDeviceConnected(i);
    }, error => {
      this.presentToast('Error Connecting Device Insecure' + JSON.stringify(error), 3000);
      this.isConnected = false;
      this.pairedDevices[i]['isConnected'] = false;
    });
  }

  private makeDeviceConnected(i) {
    this.pairedDevices[i]['isConnected'] = true;
    this.connectedDevice = this.pairedDevices[i];
    this.isConnected = true;
    this.buffer = '';
    this.writeData = '';
    this.dataSent = '';
    this.subscribeToData();
  }
  private connectUnPairedDevice(i) {
    let mac_address_or_uuid = this.pairedDevices[i].id;
    this.bluetoothSerial.connect(mac_address_or_uuid).subscribe(connection => {
      this.presentAlert(JSON.stringify(connection));
      this.pairedDevices[i]['isConnected'] = true;
    }, noConnection => {
      this.presentAlert(JSON.stringify(noConnection));
    });
  }

  private sendData(data) {
    this.bluetoothSerial.write(data).then(success => {
      // this.presentToast(success);
      this.dataSent += data;
      this.writeData = '';
    }, error => {
      this.presentToast(error);
    });
  }
  private subscribeToData() {
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      // this.presentToast(J SON.stringify(success));
      if (success) {
        this.buffer += success;
      }
    }, error => {
      this.presentToast(error);
    })
  }

  private readData() {
    // this.notify('Checking subscribe data');
    // while(1){
    this.bluetoothSerial.read().then(buffer => {
      if (buffer) {
        this.buffer += buffer;
      }
    });
    // }
  }

  private availableData() {
    // this.notify('Checking available data');
    this.bluetoothSerial.available().then(bytes => {
      this.presentAlert(JSON.stringify(bytes));
    });
  }

  // private notify(text){
  //   this.localNotifications.schedule({
  //     id: 1,
  //     text: 'Single ILocalNotification',
  //     sound: this.plt.is('android')? 'file://sound.mp3': 'file://beep.caf',
  //     data: { secret: 'secret' },
  //     foreground: true
  //   });
  // }
}
