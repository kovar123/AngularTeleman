import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merge, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SpeechError } from '../model/speech-error';
import { SpeechEvent } from '../model/speech-event';
import { SpeechRecognizerService } from '../web-apis/speech-recognizer.service';
import { ActionContext } from '../actions/action-context';
import { SpeechNotification } from '../model/speech-notification';
import { defaultLanguage, languages } from '../model/languages';
import notify from 'devextreme/ui/notify';
import { SpeechSynthesizerService } from '../web-apis/speech-synthesizer.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { bootstrapXbox } from '@ng-icons/bootstrap-icons';


@Component({
  selector: 'speech-comp',
  templateUrl: './web-speech.component.html',
  styleUrls: ['./web-speech.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WebSpeechComponent implements OnInit {
  TogglePopup() {
    this.popupVisible = !this.popupVisible;
  }
  languages: string[] = languages;
  currentLanguage: string = defaultLanguage;

  totalTranscript?: string;
  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$ = new Subject<string | undefined>();
  popupVisible: any;
  positionOf: any;

  constructor(
    private speechRecognizer: SpeechRecognizerService,
    private actionContext: ActionContext,
    private speekSrv: SpeechSynthesizerService
  ) {}

  ngOnInit(): void {
    const webSpeechReady = this.speechRecognizer.initialize(
      this.currentLanguage
    );
    if (webSpeechReady) {
      this.initRecognition();
      this.start();
    } else {
      this.errorMessage$ = of(
        'Your Browser is not supported. Please try Google Chrome.'
      );
    }
  }

public SetupComponents= (grid: DxDataGridComponent,fun1:() => void): void => {
  this.actionContext.SetupComponents(grid,fun1);
}

  speechStart() {
    this.start();
  }

  resetSpeech = () => {
    this.stop();
  };

  ngOnDestroy(): void {}

  start(): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
      return;
    }
    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  private initRecognition(): void {

    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        this.processNotification(notification);
      }),
      map((notification) => notification.content || '')
    );

    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(map((notification) => notification.event === SpeechEvent.Start));

    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        if (data === undefined) {
          return '';
        }
        if (typeof data === 'string') {
          return data;
        }
        let message;
        switch (data.error) {
          case SpeechError.NotAllowed:
            message = `Cannot run the demo.
            Your browser is not authorized to access your microphone.
            Verify that your browser has access to your microphone and try again.`;
            break;
          case SpeechError.NoSpeech:
            message = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.AudioCapture:
            message = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            message = '';
            break;
        }
        return message;
      })
    );
  }

  trimSpecialCharacters(input: string): string {
    return input.replace(/[.:?$@]+$/, '').toLocaleLowerCase();
  }

  private processNotification(notification: SpeechNotification<string>): void {
    const message = this.trimSpecialCharacters(
      notification.content?.trim() || ''
    );
    if (notification.event === SpeechEvent.FinalContent) {
      this.actionContext.processMessage(message, this.currentLanguage);
      this.actionContext.runAction(message, this.currentLanguage);
      this.totalTranscript = this.totalTranscript
        ? `${this.totalTranscript}\n${message}`
        : notification.content;
    } else {
      if (message === 'help') this.TogglePopup();
    }
  }
}
