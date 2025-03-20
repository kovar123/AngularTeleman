import { Component, OnInit } from '@angular/core';
import { TelemanService } from '../../../services/teleman.service';
import { ProgramTv } from '../../../services/programTv';
import { Appointment } from '../../../Interfaces/Appointment';
import { KanalTv } from '../../../services/TvInterfaces';
import { sortBy, uniqBy } from 'lodash';
import Query from 'devextreme/data/query';



@Component({
  selector: 'my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.css'],
  standalone:false
  
})
export class MyScheduleComponent implements OnInit {
  
  
appointmentsData: Appointment[] = [];
currentDate: string|number|Date;
  odTeraz: boolean = true;
  typProgramu: number | null=null;
  idProgramu: number | null= null;
  
  programs:ProgramTv[] = [];
  kanaly: KanalTv[] = [];

  fillData(x: ProgramTv[]): void {
    this.appointmentsData = x.map((x) => ({
      text: x.tytul,
      startDate: new Date(x.data),
      endDate: new Date(x.dataDo),
      description: x.opis,
      kod: x.kanalytvId,
      id: x.id,
    }));
  }


  constructor(private srv: TelemanService) {
   
      this.currentDate= new Date();
      srv.GetProgramsList().subscribe((x) => {
      this.kanaly = x;
      this.kanaly=sortBy(this.kanaly,"programNazwa")  
    })

   }

   
   refreshData = () => {
    this.srv.GetProgramsQUERY(this.odTeraz,this.typProgramu,this.idProgramu).subscribe((x) =>this.fillData(x));
  };

  getProgramById = (id: string) => {
    Query(this.programs).filter(['id', '=', id]).toArray()[0];
  }


  ngOnInit() {
    this.refreshData();

  }

}
