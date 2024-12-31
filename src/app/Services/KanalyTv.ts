export interface KanalTv {
    programNazwa: string | null;
    kod:          number | null;
    aktywny:      boolean | null;
    myTvNr:       number| null;
    id:           number| null;
}

export interface DtoUniElement{
    id:number  | null;
    ids?:string | null;
    text?:string | null; 
    disabled:boolean | null;
}

