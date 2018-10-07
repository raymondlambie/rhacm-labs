import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

import { Page1 } from '../page1/page1';

@Component({
  selector: 'page-demos',
  templateUrl: 'demos.html'
})
export class DemosPage extends SettingBasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService) {

  	super( navCtrl, navParams, cdr, abc );

  }

  ionViewDidLoad() {
    
  }

  doDemo( ) {

    console.log( 'demos click' );
  	this.abc.demo_start( );

    this.navCtrl.setRoot( Page1 );
  }

}
