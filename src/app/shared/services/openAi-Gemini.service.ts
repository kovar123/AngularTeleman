import {GoogleGenerativeAI  } from '@google/generative-ai';
import { Injectable } from '@angular/core';


const genAi= new GoogleGenerativeAI('AIzaSyDFYHv0mATkbcmNxR8seHt7WSMixs3FPFk')

@Injectable({
  providedIn: 'root'
})
export class OpenAiGeminiService {
  private genAi=genAi.getGenerativeModel({ model: "gemini-1.5-flash" })
  
  async fetchAnswer(question:string):Promise<string>{
    let prompt=question+'Convert the answer'
    const result = await this.genAi.generateContent(prompt)
    const response= await result.response
    const answer= response.text()
    return answer
  }

}
