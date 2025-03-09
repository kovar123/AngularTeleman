import { Injectable } from '@angular/core';
import { SpeechSynthesizerService } from '../web-apis/speech-synthesizer.service';
import { ActionStrategy } from './action-strategy';
import { DxDataGridComponent } from 'devextreme-angular';


@Injectable({
  providedIn: 'root',
})
export class GridFilterStrategy extends ActionStrategy {

  private _grid: DxDataGridComponent | undefined;
  
  reset(): void {
    this._grid?.instance.clearFilter();
  }

  editItem(): void {
    this._grid?.instance.editRow(0);
  }
  deleteItem: any;

  constructor(private speechSynthesizer: SpeechSynthesizerService) {
    super();
    this.mapStartSignal.set('pl-PL', 'filtruj');
    this.mapStartSignal.set('pl-PL', 'szukaj');
    
    this.mapEndSignal.set('pl-PL', 'koniec');
    this.mapInitResponse.set('pl-PL', 'podaj filtr');
    this.mapActionDone.set('pl-PL', 'gotowe');
    this.commands=  {
      reset: this.reset.bind(this),
      edit: this.editItem.bind(this),
      
    };


  }


  setGrid=(grid: DxDataGridComponent)=> {
    this._grid = grid;
  }

  last: string = '';

  runAction(input: string, language: string): void {
    if(this.last === input) return;
    this.last = input
    if (this.commands[input]) {
      this.commands[input]();
      return;
    }
    

    var jest = Array.from(this.mapEndSignal.values()).some(x => input.includes(x));
    if(jest){
      this._grid?.instance.clearFilter();
      return;
    }

    if(this.mapStartSignal.get(language)!==input){
      this.speechSynthesizer.speak(input, language);
      this._grid?.instance.searchByText(input)
    }

  }
}
