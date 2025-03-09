import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { DxButtonModule,DxPopupModule } from 'devextreme-angular';
import { WebSpeechComponent } from './web-speech/web-speech.component';

@NgModule({
  declarations: [ WebSpeechComponent],
  imports: [
    BrowserModule,DxButtonModule,DxPopupModule
  ],
  providers: [ ],
  exports:[WebSpeechComponent]

})
export class SpeechModule { }
