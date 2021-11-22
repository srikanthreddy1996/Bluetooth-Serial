import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// import { LocalStorageService } from '../app/services/local-storage.service';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@capacitor/device';
// import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router
    // private localStorage: LocalStorageService,
    // private androidPermissions: AndroidPermissions,
  ) {
    this.initializeApp();
  }
  initializeApp(){
    this.platform.ready().then(()=>{
      this.router.navigateByUrl('splash-screen');
      // this.router.navigateByUrl('bluetooth');
      // this.router.navigateByUrl('bluetooth-serial');
    });
  }
}
