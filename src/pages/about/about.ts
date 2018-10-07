import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage extends SettingBasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService)  { 

    super( navCtrl, navParams, cdr, abc );

  }

  ionViewWillEnter() {

    super.ionViewWillEnter( );

    // this.init( { pd1p: 25, pd1i: 3, pd1d: 128, pd1lck: 120, pd1imn: 0, pd1imx: 20 } );

  }

}
