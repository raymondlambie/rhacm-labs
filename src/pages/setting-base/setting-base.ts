import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MeBaristaService } from '../../providers/me-barista-service';

@Component({
  selector: 'page-setting-base',
  templateUrl: 'setting-base.html'
})
export class SettingBasePage {

  @ViewChild('tt42') tt42;
  @ViewChild('spinner') spinner;

  pars: any;
  pars_defaults: any;
  pars_undo: any;
  sub: any;
  temperature: any;
  spinner_show: boolean;

  header_template: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cdr: ChangeDetectorRef, public abc: MeBaristaService ) {
	
    this.pars = {};
    this.pars_defaults = {};
    this.pars_undo = {};

    if( this.abc.connected )
      this.temperature = this.abc.temperature.toFixed( 2 ) + ' °C'; 
    else
      this.temperature = '---,-- °C';

    this.spinner_show = !this.abc.connected;
  //  this.spinner.paused = !this.abc.scanning;

    this.header_template = '<ion-header><ion-navbar>' +
    '<ion-spinner #spinner [hidden]="!spinner_show" [paused]="!this.abc.scanning" (click)="this.abc.bt_discover()" style="float: right; margin-right: 1em; width: 1.5em; height: 1.5em;"></ion-spinner>' +
    '<span #tt42 [hidden]="spinner_show" style="float: right; margin-right: 1em;">{{temperature}}</span>' +
    '<button ion-button menuToggle> <ion-icon name="menu"></ion-icon> </button> <ion-title>meBarista</ion-title> </ion-navbar> </ion-header>';

  }

  processUpdate( ) {

    if( this.abc.connected )
      this.temperature = this.abc.temperature.toFixed( 2 ) + ' °C'; 
    else
      this.temperature = '---,-- °C';

    this.spinner_show = !this.abc.connected;
    // dit krakte niet? this.spinner.paused = !this.abc.scanning;
    
  }
  
  ionViewWillEnter() {
  
    this.sub = this.abc.temperature_s1.subscribe( data => { 
    //console.log('sub ' + this.abc.temperature); 

    //this.tt42 = this.abc.temperature + ' °'; 
    
    this.processUpdate( );
    this.cdr.detectChanges( ); 

  } );

  }

  ionViewWillLeave() {

    // this.abc.temperature_s1.unsubscribe();
    this.sub.unsubscribe();
  
  }

  init( defaults: any ) {

    this.pars_defaults = defaults;
    this.pars = this.abc.fetch( this.pars_defaults );
    this.doCopy( this.pars_undo, this.pars );
  
  }

  doCompare( o1: any, o2: any ) {

  	for (var attr in o1) 
        if( o1[attr] != o2[attr] ) {

          // console.log( 'Compare ' + attr + ' from ' + o2[ attr] + ' to ' + o1[ attr ] );
        
        	return true;
        
        }

    return false;

  }

  doCopy( dest: any, src: any ) {

  	for (var attr in src)
        if (src.hasOwnProperty(attr)) 
        	dest[attr] = src[attr];	

  }

  getDiff( src: any, check: any ) {

    var res = {};

    for (var attr in src)
        if (src.hasOwnProperty(attr) && src[attr] != check[attr] )
            res[ attr ] = src[ attr ];

    return res;

  }

  showDefaults() {

  	return this.doCompare( this.pars, this.pars_defaults ); 	

  }

  doDefaults() {

  	this.doCopy( this.pars, this.pars_defaults );  	

  }

  showUndo() {

  	return this.doCompare( this.pars, this.pars_undo );

  }

  doUndo() {

  	this.doCopy( this.pars, this.pars_undo );

  }

  showUpdate() {

  	return this.showUndo();

  }

  doUpdate() {

    console.log( this.getDiff( this.pars, this.pars_undo ) );

  	this.abc.update( this.getDiff( this.pars, this.pars_undo ) );

  	this.doCopy( this.pars_undo, this.pars );

  	this.abc.message = 'Updated';

  }

  notify( event: any ) {

      // this.show_defaults = true;

  		// TODO: do we still want this??

    	//console.log( 'ionChange: ' + event._elementRef.nativeElement.id );
   
   		//if( event.value != undefined )
   		//	console.log( 'value = ' + event.value );

   		//if( event.checked != undefined )
   		//	console.log( 'checked = ' + event.checked );

		//if( event.target != undefined )
   		//	console.log( 'target = ' + event.target );

   		//if( event.currentTarget != undefined )
   			//console.log( 'currentraget = ' + event.currentTarget );

        // console.log( this.xinspect( event._elementRef.nativeElement, '' ) );

  }

}
