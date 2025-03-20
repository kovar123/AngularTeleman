// To parse this data:
//
//   import { Convert } from "./file";
//
//   const programTv = Convert.toProgramTv(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ProgramTv {
    id:                    number;
    data:                  Date;
    dataDo:                Date;
    kategoria:             Kategoria | null;
    kategoriaOpis:         string;
    link:                  string;
    opis:                  string;
    powiadom:              boolean;
    programNazwa:          string;
    tytul:                 string;
    kanalytvId:            number;
    idKategorii:           number;
    status:                number;
    produkcja:             string;
    typProgramu:           number;
    alertLevel:            null;
    idKategoriiNavigation: null;
    kanalytv:              null;

}

export enum Kategoria {
    CatDok = "cat-dok",
    CatFil = "cat-fil",
    CatRoz = "cat-roz",
    CatSer = "cat-ser",
    CatSpo = "cat-spo",
    CatXxx = "cat-xxx",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertTV {
    public static toProgramTv(json: string): ProgramTv[] {
        return cast(JSON.parse(json), a(r("ProgramTv")));
    }

    public static programTvToJson(value: ProgramTv[]): string {
        return JSON.stringify(uncast(value, a(r("ProgramTv"))), null, 2);
    }

    public static ColorizeRow(prg:ProgramTv): string {
        var color = "white"
        if(prg.kategoria==Kategoria.CatDok) color= "rgba(8, 111, 228, 0.65)"
        if(prg.kategoria==Kategoria.CatFil) color="rgba(217, 228, 8, 0.77)"
        if(prg.kategoria==Kategoria.CatRoz) color="rgb(228, 188, 8)"
        if(prg.kategoria==Kategoria.CatSer) color= "yellow"
        if(prg.kategoria==Kategoria.CatSpo) color= "rgba(9, 222, 2, 0.82)"
        if(prg.kategoria==Kategoria.CatXxx) color= "rgba(5, 84, 145, 0.28)"
        
        
        if(prg.kategoriaOpis.includes("komedi")) color= "rgba(245, 225, 0, 0.33)"
        if(prg.kategoriaOpis.includes("dramat")) color= "rgba(145, 5, 108, 0.25)"
        if(prg.kategoriaOpis.includes("horror")) color= "rgba(145, 5, 108, 0.55)"
        if(prg.kategoriaOpis.includes("przygodowy")) color= "rgba(8, 111, 228, 0.32)"
        
        return color
    }


}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ProgramTv": o([
        { json: "id", js: "id", typ: 0 },
        { json: "data", js: "data", typ: Date },
        { json: "dataDo", js: "dataDo", typ: Date },
        { json: "kategoria", js: "kategoria", typ: r("Kategoria") },
        { json: "kategoriaOpis", js: "kategoriaOpis", typ: "" },
        { json: "link", js: "link", typ: "" },
        { json: "opis", js: "opis", typ: "" },
        { json: "powiadom", js: "powiadom", typ: true },
        { json: "programNazwa", js: "programNazwa", typ: "" },
        { json: "tytul", js: "tytul", typ: "" },
        { json: "kanalytvId", js: "kanalytvId", typ: 0 },
        { json: "idKategorii", js: "idKategorii", typ: 0 },
        { json: "status", js: "status", typ: 0 },
        { json: "produkcja", js: "produkcja", typ: "" },
        { json: "typProgramu", js: "typProgramu", typ: 0 },
        { json: "alertLevel", js: "alertLevel", typ: null },
        { json: "idKategoriiNavigation", js: "idKategoriiNavigation", typ: null },
        { json: "kanalytv", js: "kanalytv", typ: null },
    ], false),
    "Kategoria": [
        "cat-dok",
        "cat-fil",
        "cat-roz",
        "cat-ser",
        "cat-spo",
        "cat-xxx",
    ],
};
