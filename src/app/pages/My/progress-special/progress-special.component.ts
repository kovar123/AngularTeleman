import { Component, OnInit, NgModule, Input } from '@angular/core';
import moment, { Moment } from 'moment';
import 'moment/locale/pl';
import { ConvertProgress } from './ProgressDescription';
import { DxProgressBarTypes } from "devextreme-angular/ui/progress-bar"

@Component({
  selector: 'app-progress-special',
  templateUrl: './progress-special.component.html',
  styleUrls: ['./progress-special.component.css'],
  standalone: false,
})
export class ProgressSpecialComponent implements OnInit {
  @Input() start: Date | null = null;
  @Input() end: Date | null = null;
  //progressBarStyle='danger'
  before = false;
  minValue: number = 0;
  maxValue: number = 100;

  value: any;
  visible: boolean = true;
  opis: string = '';

  onInitialize(e:DxProgressBarTypes.InitializedEvent ) {
    //var s=e.component?.$
    
//    e.element?.find('.dx-progressbar-range').css({ 'background-color': 'blue' });
  }


  constructor() {}

  ngOnInit() {
    var c = new ConvertProgress(this.start, this.end, new Date());
    this.opis = c.GetDescription();
    this.maxValue = c.MaxValue;
    this.value = c.Value;
  }

  opisCaption = (x: number) => {
    return this.opis;
  };

  progressBarStyle = (): string => {
    // var color='danger';
    // if (!this.before) {
    //   color='warning';
    // }
    return 'danger';
  };
}
