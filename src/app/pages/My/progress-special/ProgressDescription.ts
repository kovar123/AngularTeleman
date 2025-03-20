import moment from "moment"

export enum Trwanie {
    przed = -1,
    trwa = 0,
    po = 1,   
}

export class ConvertProgress {
    mStart: moment.Moment;
    mEnd: moment.Moment;
    mCurrent: moment.Moment;
    trwanie: Trwanie = Trwanie.przed;
    durationMaxMin: number = 100;
    Value: number = 0;
    Text: string = '';
    Color: string = 'success'
    progressVisible: boolean = false;

    constructor(dStart: Date | null, dEnd: Date | null, dCurrent: Date) {
        this.mStart = moment(dStart)
        this.mEnd = moment(dEnd)
        this.mCurrent = moment(dCurrent)
        if (this.mCurrent.isAfter(this.mStart) && this.mCurrent.isBefore(this.mEnd)) 
            this.trwanie = Trwanie.trwa
        else if (this.mCurrent.isBefore(this.mStart))
            this.trwanie = Trwanie.przed
        else
            this.trwanie = Trwanie.po


        switch (this.trwanie) {
            case Trwanie.trwa:
                var durationFull = moment.duration(this.mEnd.diff(this.mStart)).locale('pl');
                this.durationMaxMin = Math.round(durationFull.asMinutes())
                var doTeraz = moment.duration(this.mCurrent.diff(this.mStart)).locale('pl');
                var doTerazMin = doTeraz.asMinutes();

                this.Value = doTerazMin;
                this.FormatDuration(doTeraz, durationFull);
                this.Color = 'warning'
                this.progressVisible = true;
                break;
            case Trwanie.przed:
                var durationFull = moment.duration(this.mEnd.diff(this.mCurrent));
                this.durationMaxMin = durationFull.asMinutes()
                var doTeraz = moment.duration(this.mStart.diff(this.mCurrent));
                this.Value = doTeraz.asMinutes();
                this.FormatDuration(doTeraz, durationFull);
                this.Color = "danger"
                break;

            case Trwanie.po:

                var durationFull = moment.duration(this.mCurrent.diff(this.mStart)).locale('pl');
                this.durationMaxMin = durationFull.asMinutes()

                var doTeraz = moment.duration(this.mCurrent.diff(this.mEnd)).locale('pl');
                this.Value = doTeraz.asMinutes();

                this.FormatDuration(doTeraz, durationFull);
                this.Color = "error"

                break;
        }
    }

    FormatDurationFragment(span: moment.Duration): string {
        var s = `${(span.years() > 0 ? span.years() + 'r' : '')}${(span.months() > 0 ? span.months() + 'M' : '')}${(span.days() > 0 ? span.days() + 'd' : '')}
        ${(span.hours() > 0 ? span.hours() + 'h' : '')}${(span.minutes() > 0 ? span.minutes() + 'm' : '')}`;
        return !s ? 'teraz' : s.trim();
    }

    FormatDuration(fragment: moment.Duration, okres: moment.Duration) {
        switch (this.trwanie) {
            case Trwanie.trwa:
//                var reszta = okres.subtract(fragment)
                this.Text = `${this.FormatDurationFragment(fragment)}*  [${this.FormatDurationFragment(okres)}]`
                break
            case Trwanie.przed: 
//                var reszta = okres.subtract(fragment)
                this.Text = `za:${this.FormatDurationFragment(fragment)}[${this.FormatDurationFragment(okres)}]`
                break
            case Trwanie.po:
                this.Text = `po:${fragment.locale('pl').humanize(true, { m: 1 })}/${okres.humanize()}`;
                break
        }
    }

    public GetDescription(): string {
        return this.Text;
    }

}