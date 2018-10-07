import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-installation',
  templateUrl: 'installation.html'
})
export class InstallationPage extends SettingBasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService, private iab: InAppBrowser )  { 

    super( navCtrl, navParams, cdr, abc );

  }

  ionViewWillEnter() {

    super.ionViewWillEnter( );

    this.init( {} );

    // const browser = this.iab.create('https://mecoffee.nl/');

  }

}