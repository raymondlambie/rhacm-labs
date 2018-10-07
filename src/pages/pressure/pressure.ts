import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

@Component({
  selector: 'page-pressure',
  templateUrl: 'pressure.html'
})
export class PressurePage extends SettingBasePage {

  constructor( public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService ) {

  	super( navCtrl, navParams, cdr, abc );

  }

  ionViewWillEnter() {

  	super.ionViewWillEnter( );
  	
	this.init( { pp1: 100, pp2: 100, ppt: 25 } );

  }

}
