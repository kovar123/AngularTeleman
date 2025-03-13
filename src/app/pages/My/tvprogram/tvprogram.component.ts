import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConvertTV, ProgramTv } from '../../../services/programTv';
import { TelemanService } from '../../../services/teleman.service';
import { ValueChangedEvent } from 'devextreme/ui/select_box';
import { KanalTv,DtoUniElement } from '../../../services/KanalyTv';
import { sortBy, uniqBy } from 'lodash';
import { DxDataGridComponent } from 'devextreme-angular';
import { WebSpeechComponent } from '../../../services/speech/speech/web-speech/web-speech.component';
import { OpenAiGeminiService } from '../../../shared/services/openAi-Gemini.service';



@Component({
  selector: 'app-tvprogram',
  templateUrl: './tvprogram.component.html',
  styleUrls: ['./tvprogram.component.css'],
  standalone: false,
})

export class TvprogramComponent implements OnInit,  AfterViewInit {
  @ViewChild(DxDataGridComponent, { static: true }) dGrid: DxDataGridComponent | undefined = undefined;
  @ViewChild(WebSpeechComponent,{ static: false }) webSpeech: WebSpeechComponent | undefined = undefined;

  kanaly: KanalTv[] = [];
  programs: ProgramTv[] = [];

  listInitialize=true
  typyProgramow:DtoUniElement[]=[]
  typProgramu: number |null =null;

  store: any;
  keyId: any;
  maxValue = 200;
  seconds = 100;
  tvs: any;
  odTeraz: boolean = true;
  totalCount: any;
  idProgramu: number | null=0;
  idGrid: any;
  focusedId: any;
  maxLength: string|number=10;
  inputData: string = 'Dane';
  outputData: any;
  popupVisible: boolean = false;
  iframeSrc='https://www.teleman.pl/tv/Polska-z-Gory-2-Wzdluz-Gor-Swietokrzyskich-13-1848048';
  viewInfo=()=>{this.popupVisible=true}

  constructor(private srv: TelemanService, private geminisrv:OpenAiGeminiService){
  
    //#region LADOWANIE DANYCH

    srv.GetProgramsList().subscribe((x) => {
      this.kanaly = x;
      this.kanaly.push({id:null,aktywny:true,kod:-1,programNazwa:'-- clear --',myTvNr:-1})
      this.kanaly=sortBy(this.kanaly,"programNazwa")  
    })
  }

  fillData=(data:ProgramTv[]) =>{

    if(this.listInitialize){
      this.listInitialize=false
    var dat=uniqBy(data,"idKategorii")
    this.typyProgramow = dat.map(item=>({id:item.idKategorii,ids:item.kategoria,text:item.kategoria,disabled:false}))  
    this.typyProgramow.push({id:-1,ids:'',text:"-- clear --",disabled:false})
    this.typyProgramow=sortBy(this.typyProgramow,"text")  
    
    }
    this.tvs = data

  } 

  setFilter=($typ:number)=>{
    if($typ>0) this.typProgramu=$typ
    else
      this.typProgramu=null
    this.refreshData()

  }
  
  programChanged($event: ValueChangedEvent) {
    this.idProgramu=$event.value
    this.refreshData()
  }

  refreshData = () => {
    this.srv.GetProgramsQUERY(this.odTeraz,this.typProgramu,this.idProgramu).subscribe((x) =>this.fillData(x));
  };
  
  geminiFind() {
    var question = `struktura danych: 
      export interface ProgramTv {
        id:                    number;
        data:                  Date;    // data i godzina rozpoczęcia programu
        dataDo:                Date;    // data i godzina zakończenia programu
        kategoriaOpis:         string;   // opis kategorii programu (np. cat-fil:"film", cat-dok:"dokument", cat-spo:"sport", cat-ser:"serial")
        opis:                  string;   // opis treści programu 
        powiadom:              boolean;  // czy program ma być powiadomiony
        programNazwa:          string;   // nazwa programu np
        tytul:                 string;    // zawiera tytuł programu
        kanalytvId:            number;
        idKategorii:           number;
        status:                number;
        produkcja:             string;
        typProgramu:           number;
        alertLevel:            null;
        idKategoriiNavigation: null;
        kanalytv:              null;
    }
    
    celem jest na podstawie zadanego pytania zbudowanie kolekcji filtrów do danych
    
    przykładowe pytanie:
    "pokaz mi wszystkie programy z kategorii film w godzinach 20-22"
    `
    this.geminisrv.fetchAnswer(question).then(x => this.outputData = x)
}

//#endregion

  showAlert=():void=>{
    alert(this.focusedId)
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refreshData();
    this.idGrid= this.dGrid?.instance;
    this.webSpeech?.SetupComponents(this.idGrid,this.showAlert)
    
  }

  resetGrid() {
    this.idGrid.searchByText('')
 }
  



  format(ratio: any) {
    return `Loading: ${ratio * 100}%`;
  }

  GetMax(x: any): number {
    return x.postep;
  }
  onValueChanged = ($event: ValueChangedEvent) => {
    this.odTeraz = $event.value;
    this.refreshData();
  };

  vievPopupInfo() {
    this.popupVisible=true
  }

  onRowPrepared(e:any) {
    if (e.rowType === 'data') 
      e.rowElement.style.backgroundColor = ConvertTV.ColorizeRow(e.data);     ;
  }

}





