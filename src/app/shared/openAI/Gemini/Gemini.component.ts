import { Component, OnInit } from '@angular/core';
import { OpenAiGeminiService } from '../../services/openAi-Gemini.service';


@Component({
  selector: 'Gemini-component',
  templateUrl: './Gemini.component.html',
  styleUrls: ['./Gemini.component.css'],
  standalone:false
})

export class OpenAiFormComponent implements OnInit {
  
  question:string='angular co to klasa Observable'
  answer:any;
 
  constructor(private aiSrv:OpenAiGeminiService) { 
    this.question= 'struktura danych: export interface ProgramTv {  data: Date; dataDo: Date; kanal: string; tytul: string; opis: string; }\n'
   this.question+= 'gdzie data - data i godzina rozpoczęcia programu, dataDo - data i godzina zakończenia programu, kanal - nazwa kanału, tytul - tytuł programu, opis - opis programu\n'
   this.question+= 'potrzebuje na podstawie pytania sformuowanego w jezyku naturalnym\n'
    this.question+= 'wygenerować krytaria filtrowania dla odpowiednich kolumn dla programów ProgramTv\n'
    this.question+= 'przykład pytania:  pokaz programy sportowe  \n'


  }  

  ngOnInit() {
      
  }

  GoAi=()=>{
 

      this.aiSrv.fetchAnswer(this.question).then(x=>this.answer=x)
  }
  

}
