import { pgAdvLibAction } from "./pg-adv-lib-action";

export class pgAdvLibPatternDef {
    //... other fields to define goes here
    action?     : string;
}

export class pgAdvLibPattern extends pgAdvLibPatternDef {

    constructor(config?: pgAdvLibPatternDef) {
        super();
        if(config) Object.assign(this, config);
    }
}