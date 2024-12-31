import { Injectable } from '@angular/core';
import {  OpenAI } from 'openai';


@Injectable({
  providedIn: 'root'
})
export class OpenAiService {


  constructor() { }

  getData(){

    try {
      
    const client = new OpenAI({
      apiKey: "",
      dangerouslyAllowBrowser:true      
    });
      
    const completion = client.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "user", "content": "write a haiku about ai"},
      ],
    });
    
    completion.then((result) =>

        alert((result.choices[0].message)    

        ));

      } catch (error) {
      
      }
  

  }  
  

}
