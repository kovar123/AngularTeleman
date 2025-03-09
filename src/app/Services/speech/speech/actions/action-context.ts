import { Injectable } from '@angular/core';
import { ActionStrategy } from './action-strategy';


import { SpeechSynthesizerService } from '../web-apis/speech-synthesizer.service';
import { GridFilterStrategy } from './grid-filter-strategy';
import { DxDataGridComponent } from 'devextreme-angular';

@Injectable({
  providedIn: 'root',
})
export class ActionContext {
  private currentStrategy?: ActionStrategy;

  constructor(
    private gridStrategy: GridFilterStrategy,
    private speechSynthesizer: SpeechSynthesizerService
  ) {

  }


  trimSpecialCharacters(input: string): string {
    return input.replace(/[.:?$@]+$/, '').toLocaleLowerCase();
  }


  processMessage(message: string, language: string): void {
    const msg = this.trimSpecialCharacters(message);
    const hasChangedStrategy = this.hasChangedStrategy(msg, language);  // zmienia strategie

    let isFinishSignal = false;
    if (!hasChangedStrategy) {
      isFinishSignal = this.isFinishSignal(msg, language);
    }

    if (!hasChangedStrategy && !isFinishSignal) {
      this.runAction(message, language);
    }
  }

  runAction(input: string, language: string): void {
    if (this.currentStrategy) {
      this.currentStrategy.runAction(input, language);
    }
  }

  setStrategy(strategy: ActionStrategy | undefined): void {
    this.currentStrategy = strategy;
  }

  SetupComponents= (grid: DxDataGridComponent,fun1:any): void => {
    this.gridStrategy.setGrid(grid);
    this.gridStrategy.commands['edit'] = fun1;
  }



  private hasChangedStrategy(message: string, language: string): boolean {
    let strategy: ActionStrategy | undefined;
    if(message === this.gridStrategy.getStartSignal(language)){
            strategy = this.gridStrategy;
    }
    if (strategy) {
      this.setStrategy(strategy);
      this.speechSynthesizer.speak(strategy.getInitialResponse(language),language);
      return true;
    }

    return false;
  }

  private isFinishSignal(message: string, language: string): boolean {
    if ( message === this.gridStrategy.getEndSignal(language)    ) {
      if (this.currentStrategy) {
        this.speechSynthesizer.speak(
          this.currentStrategy.getFinishResponse(language),
          language
        );
      }
      this.setStrategy(undefined);
      return true;
    }

    return false;
  }
}
