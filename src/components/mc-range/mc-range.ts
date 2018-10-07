import { ChangeDetectorRef, Component, ElementRef, Renderer, Optional, forwardRef, Input  } from '@angular/core';

import { Platform, Config, DomController, Form, Haptic, Item, Range } from 'ionic-angular';

import { NG_VALUE_ACCESSOR } from '@angular/forms';

class TempRange extends Range {
    static decorators = undefined;
}

export const MCRANGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => McRangeComponent),
  multi: true
};

@Component({
  selector: 'mc-range',
  template:
    '<ng-content select="[range-left]"></ng-content>' +
    '<div class="range-slider" #slider>' +
      '<div class="range-tick" *ngFor="let t of _ticks" [style.left]="t.left" [class.range-tick-active]="t.active" role="presentation"></div>' +
      '<div class="range-bar" role="presentation"></div>' +
      '<div class="range-bar range-bar-active" [style.left]="_barL" [style.right]="_barR" #bar role="presentation"></div>' +
      '<div class="range-knob-handle" (ionIncrease)="_keyChg(true, false)" (ionDecrease)="_keyChg(false, false)" [ratio]="_ratioA" [val]="_valA" [pin]="_pin" [pressed]="true" [min]="_min" [max]="_max" [disabled]="_disabled" [labelId]="_lblId"></div>' +
      '<div class="range-knob-handle" (ionIncrease)="_keyChg(true, true)" (ionDecrease)="_keyChg(false, true)" [ratio]="_ratioB" [val]="_valB" [pin]="_pin" [pressed]="_pressedB" [min]="_min" [max]="_max" [disabled]="_disabled" [labelId]="_lblId" *ngIf="_dual"></div>' +
    '</div><span style="top: -1em; font-size: 80%; position: relative; float: left;">{{_min}}{{_unit}}</span><span style="top: -1em; font-size: 80%; position: relative;float:right;">{{_max}}{{_unit}}</span>' +
    '<ng-content select="[range-right]"></ng-content>',
    host: {
    '[class.range-disabled]': '_disabled',
    '[class.range-pressed]': '_pressed',
    '[class.range-has-pin]': '_pin'
  },
  providers: [MCRANGE_VALUE_ACCESSOR]
})
export class McRangeComponent extends TempRange {

  //text: string;
  _description: string;
  _unit: string;
  _plt_mf: Platform;

  constructor(
    _form: Form,
    _haptic: Haptic,
    @Optional() _item: Item,
    config: Config,
    _plt: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    _dom: DomController,
    _cd: ChangeDetectorRef

  ) {
    super( _form, _haptic, _item, config, _plt, elementRef, renderer, _dom, _cd );
    
    this._description = '';
    this._unit = '';
    this._plt_mf = _plt;

    // console.log('Hello McRange Component');
    // this.text = 'Hello World';
  }

  /**
   * @input {number} Maximum integer value of the range. Defaults to `100`.
   */
  @Input()
  get description(): string {
    return this._description;
  }
  set description(val: string) {
    this._description = val;
  }

  @Input()
  get step(): number {
    return this._step;
  }
  set step(val: number) {
    if (!isNaN(val) && val > 0) {
      this._step = val;
    }
  }

  @Input()
  get unit(): string {
    return this._unit;
  }
  set unit(val: string) {
      this._unit = ' ' + val;
  }

  _ratioToValue(ratio: number) {
    //this._step = 0.1;
    ratio = (this._max - this._min) * ratio;
    ratio = Math.round(ratio / this._step) * this._step + this._min;
    
    return Math.round( ratio * 100 ) / 100; // strange bug with 10th significant digit
 //   return clamp(this._min, ratio, this._max) + 12.3;
  }

  _pointerDown(ev: UIEvent): boolean { 

    // console.log( ev ); 

    if( ev.srcElement.className != "range-slider" || !this._plt_mf.is( 'ios' ) )
      return super._pointerDown( ev );

    return false;
  
  }

}
