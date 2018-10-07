import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingBasePage } from '../setting-base/setting-base';
import { MeBaristaService } from '../../providers/me-barista-service';

@Component({
  selector: 'page-temperature',
  templateUrl: 'temperature.html'
})
export class TemperaturePage extends SettingBasePage {

  constructor( public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService ) {

  	super( navCtrl, navParams, cdr, abc );

  }

  ionViewWillEnter() {

    super.ionViewWillEnter( );

	this.init( { tmpsp: 101, tmppap: 33, tmpstm: 125 } );

  }

}
