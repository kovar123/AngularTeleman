import { Component, OnInit, input } from '@angular/core';
import { NgModule } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pl';
import { ConvertProgress } from './ProgressDescription';
import { DxProgressBarTypes } from "devextreme-angular/ui/progress-bar"
import { DxProgressBarModule } from 'devextreme-angular';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-progress-special',
  templateUrl: './progress-special.component.html',
  styleUrls: ['./progress-special.component.css'],
  standalone: true,
  imports: [DxProgressBarModule,NgIf] ,
  

})


export class ProgressSpecialComponent implements OnInit {
  readonly start = input<Date | null>(null);
  readonly end = input<Date | null>(null);
  //progressBarStyle='danger'
  before = false;
  minValue: number = 0;
  maxValue: number = 100;
  value: number=30
  visible: boolean = true;
  opis: string = '';
  progressVisible: boolean=true;

  onInitialize(e:DxProgressBarTypes.InitializedEvent ) {
  }


  constructor() {}

  ngOnInit() {
    var c = new ConvertProgress(this.start(), this.end(), new Date());
    this.opis = c.GetDescription();
    this.maxValue = c.durationMaxMin;
    this.value = c.Value;
    this.progressVisible=c.progressVisible;
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

  
   prepareTopLabel = (): string => {
    return `${moment(this.start()).format('HH:mm')}-${moment(this.end()).format('HH:mm')}`;
    
  
  };
}
