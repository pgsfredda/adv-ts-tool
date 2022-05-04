import { pgAdvLibActionInfo } from "./pg-adv-lib-defs";

export type pgAdvLibCompassDef = {
    north    : Array<string>,
    south    : Array<string>,
    east     : Array<string>,
    west     : Array<string>,
    northeast: Array<string>,
    northwest: Array<string>,
    southeast: Array<string>,
    southwest: Array<string>,
    up       : Array<string>,
    down     : Array<string>,
    into     : Array<string>,
    outto    : Array<string>,
}

export class pgAdvLibCompass {
    values: pgAdvLibCompassDef;

    getCompass(noun: string | Partial<pgAdvLibActionInfo>) {
        let res: string;
    
        if(typeof noun === 'object') noun = noun.noun;

        for (const key in this.values) {
            if (this.values.hasOwnProperty.call(this.values, key)) {
                const element = this.values[key];
                //console.log(noun, element)
                if ((Array.isArray(element)) && (element.indexOf(noun) >= 0)) {
                    res = key;
                    break;
                }
            }
        }
        
        return res;
    }

    getCompassWorld(noun: string, index: number = 0): string {
        return (this.values && this.values[noun]? (this.values[noun][index] || '').replaceAll('^', ''): undefined);
    }
}