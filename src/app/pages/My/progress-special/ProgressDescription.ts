import moment from "moment"

export class ConvertProgress{
    mStart: moment.Moment;
    mEnd: moment.Moment;
    mPoint: moment.Moment;
    trwanie:number=0;
    MaxValue: number=100;
    Value: number=0;
    Text:string='';
    Color:string='success'
    


    constructor(dStart:Date | null,dEnd:Date | null,dPoint:Date) {
        this.mStart=moment(dStart)
        this.mEnd=moment(dEnd)
        this.mPoint=moment(dPoint)
        if(this.mPoint.isAfter(this.mStart) && this.mPoint.isBefore(this.mEnd)) this.trwanie=0
        else if(this.mPoint.isBefore(this.mStart))
            this.trwanie=-1
        else
         this.trwanie=1
        
        
         switch (this.trwanie) {
             case 0: // trwa
             var okres = moment.duration(this.mEnd.diff(this.mStart)).locale('pl');
             this.MaxValue=Math.round(okres.asMinutes())   
             var doTeraz = moment.duration(this.mPoint.diff(this.mStart)).locale('pl');
             this.Value=Math.round(doTeraz.asMinutes());
             this.FormatDuration(doTeraz,okres,this.trwanie);
             this.Color='warning'
             break;
             case -1:// przed

             
             var okres = moment.duration(this.mEnd.diff(this.mPoint));
             this.MaxValue=okres.asMinutes()   

             var doTeraz = moment.duration(this.mStart.diff(this.mPoint));
             this.Value=doTeraz.asMinutes();
            
             this.FormatDuration(doTeraz,okres,this.trwanie);
             this.Color="danger"
             break;

             case 1: // now > dt2
             
             var okres = moment.duration(this.mPoint.diff(this.mStart)).locale('pl');
             this.MaxValue=okres.asMinutes()   

             var doTeraz = moment.duration(this.mPoint.diff(this.mEnd)).locale('pl');
             this.Value=doTeraz.asMinutes();
            
             this.FormatDuration(doTeraz,okres,this.trwanie);
             this.Color="error"

                 break;
         }
 


    }

    FormatDurationFragment(span: moment.Duration):string{
        var s=`${(span.years()>0 ? span.years()+'r':'')}${(span.months()>0 ? span.months()+'m':'')}${(span.days()>0 ? span.days()+'d':'')}
        ${(span.hours()>0 ? span.hours()+'h':'')}${(span.minutes()>0 ? span.minutes()+'m':'')}`;
        return !s?'teraz':s;
    }

    FormatDuration(cz1: moment.Duration, okres: moment.Duration, trwanie: number){
        switch (this.trwanie) {
            case 0: // trwa
                var reszta=okres.subtract(cz1)
                this.Text=`${this.FormatDurationFragment(cz1)}[${this.FormatDurationFragment(reszta)}]`
                break
            case -1: 
                var reszta=okres.subtract(cz1)
                this.Text=`za:${this.FormatDurationFragment(cz1)}[${this.FormatDurationFragment(okres)}]`
                break
            case 1: 
               this.Text=`${cz1.locale('pl').humanize(true,{m:1})}/${okres.humanize()}`;
            break

        }   


        

    }

    public GetDescription():string{
        return this.Text;
    }
        
/*     
    this.max=okres.asMinutes()
        

    var odleglosc=1
    var trwa=t.isAfter(this.ds1) && t.isBefore(this.ds2)
    if(trwa){
      const doTeraz = moment.duration(t.diff(this.ds1)).locale('pl');
      this.value=doTeraz.asMinutes;
      this.opis=`${doTeraz.locale('pl').humanize()}/${okres.humanize()}`;
      return
    }
    if(t.isBefore(this.ds1)){   // jeszcze przed startem
      this.before=true
      okres = moment.duration(this.ds2.diff(t)).locale('pl');
      this.max=okres.asMinutes()
      const doTeraz = moment.duration(this.ds1.diff(t)).locale('pl');
      this.value=doTeraz.asMinutes;
      this.opis=`za:${doTeraz}/${okres.humanize()}`;
    } else{
      this.before=false
      okres = moment.duration(this.ds2.diff(t)).locale('pl');
      this.max=okres.asMinutes()
      const doTeraz = moment.duration(this.ds1.diff(t)).locale('pl');
      this.value=doTeraz.asMinutes;
      this.opis=`za:${doTeraz.locale('pl').humanize()}/${okres.humanize()}`;


    }
    



        return 'aaa'
    }
    ds1(ds1: any) {
        throw new Error("Method not implemented.");
    }
    ds2(ds2: any) {
        throw new Error("Method not implemented.");
    }
 */

}