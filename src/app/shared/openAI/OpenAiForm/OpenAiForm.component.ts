import { Component, OnInit,model } from '@angular/core';
import {GenerativeModel,GoogleGenerativeAI  } from '@google/generative-ai';
import { OpenAiGeminiService } from '../../services/openAi-Gemini.service';


@Component({
  selector: 'app-OpenAiForm',
  templateUrl: './OpenAiForm.component.html',
  styleUrls: ['./OpenAiForm.component.css'],
  standalone:false
})

export class OpenAiFormComponent implements OnInit {
  
  question:string='angular co to klasa Observable'
  answer:any;
 
  constructor(private aiSrv:OpenAiGeminiService) { 

  }  

  ngOnInit() {
      
  }

  GoAi=()=>{
 

      this.aiSrv.fetchAnswer(this.question).then(x=>this.answer=x)
  }
  

}
