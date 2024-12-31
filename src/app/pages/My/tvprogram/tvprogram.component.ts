import { Component, OnInit } from '@angular/core';
import { ProgramTv } from '../../../Services/programTv';
import { TelemanService } from '../../../Services/teleman.service';
import { ValueChangedEvent } from 'devextreme/ui/select_box';
import { KanalTv,DtoUniElement } from '../../../Services/KanalyTv';
import { sortBy, uniqBy } from 'lodash';

@Component({
  selector: 'app-tvprogram',
  templateUrl: './tvprogram.component.html',
  styleUrls: ['./tvprogram.component.css'],
  standalone: false,
})

export class TvprogramComponent implements OnInit {

  
  kanaly: KanalTv[] = [];
  programs: ProgramTv[] = [];

  listInitialize=true
  typyProgramow:DtoUniElement[]=[]
  typProgramu: string |null =null;

  store: any;
  keyId: any;
  maxValue = 200;
  seconds = 100;
  tvs: any;
  odTeraz: boolean = true;
  totalCount: any;
  idProgramu: number | null=null;

  constructor(private srv: TelemanService) {
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
    this.typyProgramow.push({id:-1,ids:'aaaaaaaaa',text:"-- clear --",disabled:false})
    this.typyProgramow=sortBy(this.typyProgramow,"text")  
    
    }
    this.tvs = data

  } 

  setFilter=($typ:string)=>{
    if($typ==='-- clear --') this.typProgramu=null
    else
        this.typProgramu=$typ
    this.refreshData()

  }
  
  programChanged($event: ValueChangedEvent) {
    this.idProgramu=$event.value
    this.refreshData()
  }

  refreshData = () => {
    this.srv.GetProgramsQUERY(this.odTeraz,this.typProgramu,this.idProgramu).subscribe((x) =>this.fillData(x));
  };

  ngOnInit() {
    this.refreshData();
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

}
