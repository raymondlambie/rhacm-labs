import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

@Component({
  selector: 'page-preinfusion',
  templateUrl: 'preinfusion.html'
})
export class PreinfusionPage extends SettingBasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService)  { 

    super( navCtrl, navParams, cdr, abc );

  }


  ionViewWillEnter() {

    super.ionViewWillEnter( );

    this.init( { pinbl: false, piprd: 3, pivlv: true, pistrt: 4  } );

  }


}
