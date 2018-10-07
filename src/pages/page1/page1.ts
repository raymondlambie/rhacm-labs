import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams, Platform, Content} from 'ionic-angular';

import { Chart } from 'chart.js';

import { SettingBasePage } from '../setting-base/setting-base';

import { MeBaristaService } from '../../providers/me-barista-service';

// import { Gauge } from 'svg-gauge';
import Gauge from 'svg-gauge';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 extends SettingBasePage {

  @ViewChild(Content) content: Content; // was allemaal class 'Content'
  @ViewChild('lineCanvas') lineCanvas;
 // @ViewChild('tt42') tt42;
  @ViewChild( 'cpuSpeed' ) powergauge_canvas;
  @ViewChild( 'cpuSpeed2' ) shottimer_canvas;
  @ViewChild('spinner') spinner;

  lineChart: any;
  powergauge: any;
  shottimer: any;
 // temperature: any;
  sub_l: any;
  shottimer_show: any;
  shottimer_hide_timeout: any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public cdr: ChangeDetectorRef, public abc: MeBaristaService  ) {

    super( navCtrl, navParams, cdr, abc );

    if( this.abc.connected )
      this.temperature = this.abc.temperature.toFixed( 2 ) + ' °'; 
    else
      this.temperature = '---,-- °';

    this.powergauge = null;
    this.shottimer_show = false;

  }

  ionViewDidLoad() {


      
        //this.powergauge.setValue( 30 );
        
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.tooltips.enabled = false;
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
 
            animation : false,
            type: 'line',
            options: {
              maintainAspectRatio: false,              
              scales: {
            xAxes: [{
                autoSkip: true,
                type: 'time',
                time: {
                    unit: 'minute',
                    parser: 'X',
                    displayFormats: {
                        minute: 'h:mm'
                    }

                }
            }]
              }
            },
            data: {

                labels: this.abc.graph_data['label'] /* ["January", "February", "March", "April", "May", "June", "July"] */,
                datasets: [
                    
                    {
                        label: "Sensor 1",
                        data: this.abc.graph_data['sensor1'],
                        fill: false,
                        borderColor: "rgba(0,0,192,1)",
                        borderWidth: 3,
                        pointRadius: 0,
                        lineTension: 1
                        // iets met line tension
                    },
                    
                    {
                        label: "Setpoint",
                        data: this.abc.graph_data['setpoint'],
                        fill: false,
                        borderColor: "rgba(0,255,0,1)",
                        borderWidth: 1,
                        pointRadius: 0
                    }

                ]
            }
 
        });

        this.fixupChart();

        if( this.powergauge == null )
          this.powergauge = Gauge( this.powergauge_canvas.nativeElement, 
          { max: 100,
            dialStartAngle: 180,
            dialEndAngle: 0,
            value: 50,
            title: "Power",
            label: function(value) {
              return Math.round(value) + " %";
            }
            } );

        if( this.shottimer == null ) {
        this.shottimer = Gauge( this.shottimer_canvas.nativeElement, 
          { max: 100,
            dialStartAngle: 180,
            dialEndAngle: 0,
            value: 50,
            title: "Shot",
            label: function(value) {
              return Math.round(value) + " s";
            }

            } );
        }

        this.powergauge.setValue( 0 );


  }

  fixupChart() {

    var tmax = Math.max.apply( Math, this.abc.graph_data['sensor1'] );
    var tmin = Math.min.apply( Math, this.abc.graph_data['sensor1'] );

    this.lineChart.options.scales.yAxes[0].ticks.max = Math.round( ( tmax + 15 ) / 5 ) * 5;
    this.lineChart.options.scales.yAxes[0].ticks.min = Math.round( ( tmin - 15 ) / 5 ) * 5;

    //this.lineChart.options.scales.xAxes[ 0 ].ticks.maxTicksLimit = 11;
    //this.lineChart.options.scales.xAxes[ 0 ].ticks.autoSkip = true;
    
    this.lineChart.options.scales.xAxes[ 0 ].time.min = this.abc.graph_data['label'][0];
    this.lineChart.options.scales.xAxes[ 0 ].time.max = this.abc.graph_data['label'].slice(-1)[0];

    this.lineChart.options.scales.xAxes[ 0 ].ticks.autoSkip = true;


    this.lineChart.options.scales.yAxes[ 0 ].mirror = true;

    this.lineChart.update();
  
  }

  ionViewWillEnter( ) {
    var f: any;

    //console.log('view-enter');

    // super.ionViewWillEnter( );

    this.sub_l = this.abc.temperature_s1.subscribe( data => { 
    //console.log('sub ' + this.abc.temperature); 

/*    
    if( this.abc.connected )
      this.temperature = this.abc.temperature.toFixed( 2 ) + ' °'; 
    else
      this.temperature = '---,-- °';

    this.spinner_show = !this.abc.connected; */
    this.processUpdate( );

    this.powergauge.setValue( this.abc.pid.power );
    
    
    // show shot timer when shot has started 
    if( this.abc.shottimer_started )
      this.shottimer_show = true;

    // update timer with current time as long as it running
    // TODO: this does not work for the DEMO

    if( this.abc.shottimer_started ) {

      f = new Date();
      this.shottimer.setValue( ( f - this.abc.shottimer_started ) / 1000 * this.abc.speed );
    
    }

    // when the shot is done, show shot time from meCoffee 
    // and start timer to hide shot timer
    if( this.abc.shottimer_duration ) {

      this.shottimer.setValue( this.abc.shottimer_duration / 1000 );

      // We have consumed, clear it ( not nice )
      this.abc.shottimer_duration = 0;

      if( this.shottimer_hide_timeout )
        clearTimeout( this.shottimer_hide_timeout );

      this.shottimer_hide_timeout = setTimeout( () => { this.shottimer_show = false; this.shottimer_hide_timeout = null; }, 30*1000 / this.abc.speed );

    }


    this.cdr.detectChanges(); 

    this.fixupChart( );
    //this.lineChart.update();

  } );

  }

  ionViewWillLeave() {

    // super.ionViewWillLeave( );

    // this.abc.temperature_s1.unsubscribe();
    this.sub_l.unsubscribe();
  }

  changeOrientation( event: any ) {
    //console.log( "changeOrientation " + event );

    // this.content.resize();
    this.ionViewDidLoad(); // fix iOS orientation issues with ChartJS canvas
  } 


  // import { Storage, SqlStorage } from 'ionic-framework/ionic';
    
  // this.storage = new Storage(SqlStorage);

  // this.storage.get('questionnaires').then((data) => {
  // if (data != null) this.questionnaires = JSON.parse(data);
  // else this.loadDefaultQuestions();
  // And to store Objects, use JSON.stringify(myObject) to store and JSON.parse(...) to turn back

}

