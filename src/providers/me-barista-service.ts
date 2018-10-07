import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
 
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import {Observable} from 'rxjs/Observable';

// import BluetoothSerialPort from 'bluetooth-serial-port';

import { File } from '@ionic-native/file';
// import SerialPort from 'serialport';

@Injectable()
export class MeBaristaService {

  // TODO: make shit private, divide into public / private
  
  message: any;
  temperature: any;
  temperature_s1: any;
  temperature_s1_Observer: any;
  temperature_s2: any;
  graph_data: any;
  line_index: any;
  log: any;
  parameters: any;
  scales: any;
  times: any;
  fresh: any;
  discover_promise: any;
  connection_subscription: any; // todo: implement unsub
  data_subscription: any;
  connected: any;
  pid: any;
  demo: any;
  shottimer_started: any;
  shottimer_duration: any;
  shottimer_ended: any;
  speed: any;
  scanning: boolean;

  bluetoothSerial: any;
  reconnect_timeout: any;
  serial_result: any;

  constructor(public http: Http, public platform: Platform, private file: File ) {

    this.message = 'Started';

    this.temperature_s1 = Observable.create(observer => {
      this.temperature_s1_Observer = observer;
    });

    this.graph_data = { sensor1: [ ], sensor2: [  ], setpoint: [ ], label: [ ] };
    this.parameters = { };
    this.scales = { tmpsp: 100, tmpstm: 100, pd1i: 100, pd1imx: 655.36, pistrt: 1000, piprd: 1000};
    this.times = { tmron: true, tmroff: true };
    this.pid = { power: 0, p: 0, i: 0, d: 0, a: 0 };
    this.demo = { speed: 20 };

    this.graph_init( );
    this.fresh = true;

    this.temperature = 0;
    this.connected = false;

    this.shottimer_started = 0;
    this.shottimer_duration = 0;
    this.shottimer_ended = 0;

    this.speed = 1 ;
    this.scanning = false;
    this.reconnect_timeout = null;
  
  }

  graph_init( ) {
    
    for( var i = 0; i < 200; i++ ) {
  
      this.graph_data[ 'setpoint' ][ i ] = 101;
      var t = (i - 100) / 32;
      // this.graph_data[ 'sensor1' ][ i ] = Math.sin( i - 100 / 32 ) * ( i - 100 ) / 8 + 70;
      this.graph_data[ 'sensor1' ][ i ] = Math.pow( Math.E, -t / 2 ) * Math.sin( 4 * t ) + 101;
      this.graph_data[ 'label' ][ i ] = i - 100;
  
    }
  
  }

  startup( ) {

    console.log('bt_enabled / startup' );

    // BLE for iOS for now

    if( this.platform.is('ios') || this.platform.is('android') ) {
    this.bluetoothSerial = new BluetoothSerial( );
    this.bt_discover( );
    }

    // BT Classic for OSX for now

    //var btSerial = new BluetoothSerialPort( );
    //btSerial.on('found', 
    //    function(address, name) { console.log( 'btSerial found ' + address + ' = ' + name ); } );
    // btSerial.inquire( );

    if( this.platform.is( 'core' ) ) {
    setTimeout( () => { this.bt_setup_classic( ); }, 5000 );
    }
  }

  bt_setup_classic( ) {

    // var btSerial = new BluetoothSerialPort.BluetoothSerialPort( );
    //btSerial.on('found', 
    //    function(address, name) { console.log( 'btSerial found ' + address + ' = ' + name ); } );
    //btSerial.inquire( );

    this.serial_result = 'bt_setup_classic';

   // this.file.checkFile( "/dev", "cu.meCoffee-DevB" ).then( found => { console.log( 'file promise fired' ); this.serial_result = ' file was ' + ( found? 'not ' : '' ) + 'found'; }, err => { console.log('file error' + err.message); } );

   //this.file.readAsText( this.file.rootDirectory, "/Users/janbranbergen/ionic.txt" ).then( found => { console.log( 'file promise fired' ); this.serial_result = ' 
   //file was ' + ( found? 'not ' : '' ) + 'found'; }, err => { console.log('file error' + err.message); } );

    console.log( 'serialpot' );

    //var sp = SerialPort( "/dev/cu.meCoffee-DevB" );

    //sp.on( 'open', function() { console.log( "port opened "); });
    //sp.on( 'error', function() { console.log( "port open failed"); });

  }

  next( ) {
        setTimeout( () =>  { this.temperature_s1_Observer.next( true ); } , 10 );
  }

  bt_discover( ) {

    if( this.reconnect_timeout ) {
      clearTimeout( this.reconnect_timeout );

      this.reconnect_timeout = null;
    }

    this.scanning = true;
    //this.temperature_s1_Observer.next( true );
    this.next( );

    //console.log( 'bt_discover' );

    // this.bluetoothSerial = new BluetoothSerial( );

    this.discover_promise = this.bluetoothSerial.list();

    this.discover_promise.then( devices => { /* console.log( 'xyz' ); */ this.bt_list( devices ); }, devices => { console.log( 'tuinkabouter' ); } );

  }
  
  bt_list( devices ) {
  var device;

  this.scanning = false;
  // this.temperature_s1_Observer.next( true );
  this.next( );

  //console.log('bt_list');

  //console.log( devices );

  if( devices.length < 1 ) {
    this.reconnect_timeout = setTimeout( () => { this.bt_discover() }, 30 * 1000 );

            return ;
  }

  device = devices[0];

  if( !device.name.startsWith( "meCoffee" ) ) {

      this.reconnect_timeout = setTimeout( () => { this.reconnect_timeout = null; this.bt_discover() }, 30 * 1000 );

            return ;
  }

  console.log('connecting. ... ');

  this.connection_subscription = this.bluetoothSerial.connect( this.platform.is('ios') ? device.uuid : device.address );

  this.connection_subscription.subscribe( res => { this.bt_connected( res ); }, res => { this.bt_disconnected( res ); } );

  }

  bt_disconnected( res ) {

    console.log("bt_disconnected");

    this.connected = false;
    this.temperature = 0;
    this.pid.power = 0;
    // this.temperature_s1_Observer.next( true ); 
    this.next( );

    //this.data_subscription.unsubscribe( );
    //this.connection_subscription.unsubscribe( );
    // Retry in 30 seconds

    setTimeout( () => { this.bt_discover( ); }, 30 * 1000 );

  }

  bt_connected( res ) {
    
    console.log('bt_connected');

    this.connected = true;
    this.temperature = 0;
    // this.temperature_s1_Observer.next( true );
    this.next( );

    this.line_index = 0;
    this.data_subscription = this.bluetoothSerial.subscribe( "\n" );

    this.data_subscription.subscribe( res => { this.bt_line( res ); } );

    console.log(res);
  
  }

  graph_add_data( data:any, add:any ) {

    if( data.length == 0 ) {
      data.fill( add );
    }

    data.push( add );

    if( data.length > 200 ) {
      data.shift();
    }

   
  }

  line_cmd_get( items ) {

    this.parameters[ items[2] ] = items[3];
  
    console.log( 'Stored ' + items[2] + ' -> ' + items[3] );
  
  }

  line_tmp( items ) {

    var temperature = items[ 3 ] / 100.0;
    var setpoint = items[ 2 ] / 100.0;
    var timestamp = items[ 1 ];

    // this.temperature_s1 = temperature;

    if( this.fresh ) {
      
      for( var i = 0; i < 200 ; i++ ) {

        this.graph_data['sensor1'][ i ] = temperature;
        this.graph_data['setpoint'][ i ] = setpoint;
        this.graph_data['label'][ i ] = timestamp - 200;

      }

      this.fresh = false;

    }
    else
    {

      this.graph_add_data( this.graph_data['sensor1'], temperature );
      this.graph_add_data( this.graph_data['setpoint'], setpoint );
      this.graph_add_data( this.graph_data['label'], timestamp );
    
    }

    this.temperature = items[ 3 ] / 100.0;
    this.temperature_s1_Observer.next( true );
  }

  line_pid( items ) {

    this.pid.p = parseInt( items[ 1 ] );
    this.pid.i = parseInt( items[ 2 ] );
    this.pid.d = parseInt( items[ 3 ] );
    this.pid.a = parseInt( items[ 4 ] );

    this.pid.power = ( this.pid.p + this.pid.i + this.pid.d + this.pid.a ) / 655.35; 

  }

  line_cmd_set( items ) {

    if( !items[ 2 ].startsWith( 's_' ) )
      return;

    this.parameters[ items[2].replace( 's_' , '' ) ] = items[3];

    console.log( 'Updated ' + items[2] + ' -> ' + items[3] );

  }

  line_sht( items ) {
    
    if( items[2]  == "0" ) {

      this.shottimer_started = new Date();
      this.shottimer_duration = 0;
      this.shottimer_ended = null;
    
      return;

    }

    this.shottimer_ended = new Date();
    this.shottimer_duration = items[2];
    this.shottimer_started = null;

  }

  bt_line( line ) {

    //console.log( 'from service: ' + line );
    //this.message = line;

    this.log += line;
    this.line_index++;

    // Initialization : get parameters and set the time

    if( this.line_index == 3 )
      this.bluetoothSerial.write( "cmd dump OK\n", res => { console.log("Written cmd dump"); }, res => { console.log("Failed cmd dump");} );

    if( this.line_index == 10 ) {

       var d:any = new Date(), e:any = new Date(d);
       var msSinceMidnight: any = e - d.setHours(0,0,0,0);

       var s = "\ncmd clock set " + Math.floor( msSinceMidnight / 1000 ) + " OK\n";

       console.log( s );

       this.bluetoothSerial.write( s,   res => { console.log("Written time"); }, res => { console.log("Failed wite time");} );

     }

    var line_items = line.split(' ');

    if( line_items[0] == "cmd" && line_items[1] == "get" ) {
      
      this.line_cmd_get( line_items );

      return;

    }

    // TODO: merge these two cmds

    if( line_items[ 0] == "cmd" && line_items[ 1 ] == "set" ) {

      this.line_cmd_set( line_items )
    
      return;

    }   

    if( line_items[ 0 ] == "tmp" ) {

      this.line_tmp( line_items );
    
      return;

    }

    if( line_items[ 0 ] == "sht" ) {

      this.line_sht( line_items );
    
      return;

    }

    if( line_items[ 0 ] == "pid" ) {

      this.line_pid( line_items );

      // console.log( line );
    
      return;

    }

    

    console.log( 'bt_line: did nothing for ' + line );

  }

  update( pars: any ) {

    for( var attr in pars ) {

        if( typeof( pars[ attr ] ) === "boolean" )
          pars[ attr ] = pars[ attr ] ? 1 : 0;

        if( this.scales[ attr ] ) 
          pars[ attr ] = Math.round( pars[ attr ] * this.scales[ attr ] );

        if( this.times[ attr ] == true ) {

            var parts = pars[ attr ].split(':');

            console.log( 'translate ' + pars[ attr ] );

            pars[ attr ] = parts[ 0 ] * 3600 + parts[ 1 ] * 60; 
        
        }
         
        console.log(  "cmd set " + attr + " " + pars[ attr ] + " OK\n" );

        if( this.bluetoothSerial )
          this.bluetoothSerial.write( "cmd set " + attr + " " + pars[ attr ] + " OK\n");
      }
    
    }
    

   doCopy( dest: any, src: any ) {

    for (var attr in src)
        if (src.hasOwnProperty(attr)) 
          dest[attr] = src[attr]; 

  }

  fetch( pars: any ) {

     var res = {};

     this.doCopy( res, pars );

     for( var attr in res )
       if( this.parameters[ attr ] ) {

         if( typeof( res[ attr ] ) === 'boolean' )
            res[ attr ] = this.parameters[ attr ] > 0 ? true : false;
         else
            res[ attr ] = this.parameters[ attr ];
       
         if( this.scales[ attr ] ) {

            res[ attr ] = res[ attr ] / this.scales[ attr ];
         

         }
         
         if( this.times[ attr ] == true ) {

            var hours = Math.floor( res[ attr ] / 3600 );
            var mins = ( res[ attr ] - hours * 3600 ) / 60;

            res[ attr ] = ( hours < 10 ? '0' : '' ) + hours + ':' + ( mins < 10 ? '0' : '' ) + mins ;
         
         }
       
       }

     return res;  
  
  }

  /*

    Demo functions 
  
  */ 
  demo_start( ) {
   
    this.http.get('assets/demos/56273d393cab0').subscribe( res => { this.demo_load( res[ '_body' ] ); } );
   
  }

  demo_load( body: any ) {

    this.demo[ 'lines' ] = body.split( '\n' );
    this.demo[ 'index' ] = 0;
    this.demo[ 'interval' ] = setInterval( () => { this.demo_line( ); }, 1000 / this.demo.speed );

    this.connected = true;
    this.speed = this.demo.speed;

  }

  demo_line( ) {
    
    for( ; this.demo.index < this.demo.lines.length ;  ) {

        var line = this.demo.lines[ this.demo.index++ ];
    
        //console.log( line );

        this.bt_line( line );

        if( line.indexOf( 'tmp ') == 0 )
          
          return;
        
    }

    this.connected = false;
    clearInterval( this.demo.interval );
    this.speed = 1 ;

  }

}
