import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

@Component({
  selector: 'page-hardware',
  templateUrl: 'hardware.html'
})
export class HardwarePage extends SettingBasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService)  { 

    super( navCtrl, navParams, cdr, abc );

  }

  ionViewWillEnter() {

    super.ionViewWillEnter( );

    this.init( { o0: 112, o1: 98, o2: 118, tmrpwr: false, pwrflp: false, s1ad: true } );

  }

}