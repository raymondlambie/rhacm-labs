import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Page1 } from '../pages/page1/page1';
import { PressurePage } from '../pages/pressure/pressure';
import { PreinfusionPage } from '../pages/preinfusion/preinfusion';
import { TemperaturePage } from '../pages/temperature/temperature';
import { TimersPage } from '../pages/timers/timers';
import { PIDPage } from '../pages/pid/pid';
import { HardwarePage } from '../pages/hardware/hardware';
import { InstallationPage } from '../pages/installation/installation';

import { AboutPage } from '../pages/about/about';
import { DemosPage } from '../pages/demos/demos';

import { MeBaristaService } from '../providers/me-barista-service';

@Component({
  templateUrl: 'app.html'
  //,
  //providers: [MeBaristaService]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public abc: MeBaristaService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      
      { title: 'Home', component: Page1 },
      { title: 'Temperature', component: TemperaturePage },
      { title: 'Preinfusion', component: PreinfusionPage },
      { title: 'Pressure', component: PressurePage },
      { title: 'Timers', component: TimersPage },
      { title: 'PID', component: PIDPage },
      { title: 'Hardware', component: HardwarePage },
      { title: 'Demos', component: DemosPage },
      { title: 'Installation', component: InstallationPage },
      { title: 'About', component: AboutPage }

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.abc.startup();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
