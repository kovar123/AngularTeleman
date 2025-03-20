import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProgramTv } from './programTv';
import { Observable } from 'rxjs/internal/Observable';
import { KanalTv } from './TvInterfaces';


@Injectable({
  providedIn: 'root'
})

export class TelemanService {

  private apiUrl = 'http://localhost:2030/'; // Adres API
  private apiUrlDev = 'http://localhost:5115/'; // Adres API
  private useIis = true


  constructor(private http: HttpClient) {
    if (!this.useIis)
      this.apiUrl = this.apiUrlDev

  }


  GetProgramsOdTeraz(): Observable<ProgramTv[]> {
    return this.http.get<ProgramTv[]>(this.apiUrl + 'Epgprograms/OdTeraz'); 
  }

  GetProgramsQUERY(odTeraz: boolean, typProgramu:number | null, kanal: number | null): Observable<ProgramTv[]> {
    var s = `${this.apiUrl}Epgprograms/Query?odTeraz=${odTeraz}${typProgramu ? '&typProgramu=' + typProgramu : ''}${kanal ? '&kanal=' + kanal : ''}`;
    return this.http.get<ProgramTv[]>(s); 
  }

  GetProgramsList(): Observable<KanalTv[]> {
    var s = this.apiUrl + 'Kanalytvs'
    return this.http.get<KanalTv[]>(s); 
  }

  FetchPrograms(): Observable<string> {
    var s = this.apiUrl + 'Epgprograms/FetchPrograms'
    return this.http.get<string>(s); 
  }

}



