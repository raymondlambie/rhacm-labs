import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

@Component({
  selector: 'page-timers',
  templateUrl: 'timers.html'
})
export class TimersPage extends SettingBasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService)  { 

    super( navCtrl, navParams, cdr, abc );

  }

  ionViewWillEnter() {

    super.ionViewWillEnter( );

    this.init( { tmrosd: 60, tmrwnbl: false, tmron: "07:30", shtmx: 60, tmrsnbl: false, tmroff: "21:00" } );

  }

}