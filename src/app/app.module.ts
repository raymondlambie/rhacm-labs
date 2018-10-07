import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
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

import { SettingBasePage } from '../pages/setting-base/setting-base';

import { StatusBar } from '@ionic-native/status-bar';

import { SplashScreen } from '@ionic-native/splash-screen';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { McRangeComponent } from '../components/mc-range/mc-range';

import { MeBaristaService } from '../providers/me-barista-service';

import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    PressurePage,
    PreinfusionPage,
    TemperaturePage,
    TimersPage,
    HardwarePage,
    InstallationPage,
    PIDPage,
    AboutPage,
    DemosPage,
    McRangeComponent,
    SettingBasePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    PressurePage,
    PreinfusionPage,
    TemperaturePage,
    TimersPage,
    HardwarePage,
    InstallationPage,
    PIDPage,
    AboutPage,
    DemosPage,
  ],
  providers: [
    InAppBrowser,
    StatusBar,
    SplashScreen,
    MeBaristaService,
    File,
    ,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
