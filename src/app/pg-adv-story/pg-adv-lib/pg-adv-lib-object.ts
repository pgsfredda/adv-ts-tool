import { pgAdvLibExitcode, pgAdvLibText, pgAdvLibObjectFunc, pgAdvLibObjectAttributes } from "./pg-adv-lib-defs";
import { pgAdvLibToken } from "./pg-adv-lib-token";

export class pgAdvLibObjectDef {
    external?   : string;
    description?: pgAdvLibText | pgAdvLibObjectFunc ;
    parent?     : string;
    name?       : Array<string>;
    attributes? : pgAdvLibObjectAttributes;
}

export class pgAdvLibObject extends pgAdvLibObjectDef {

    protected _name?: Array<pgAdvLibToken> = [];
 
    constructor(config?: pgAdvLibObjectDef) {
        super();
        if(config) Object.assign(this, config);
    }

    set name(tokens: Array<string>) {
        tokens.forEach(t => {
            this._name.push(new pgAdvLibToken(t));
        });
    }

    get name(): Array<string> {
        let a: Array<string> = [];

        this._name.forEach(n => {
            a.push(n.token);
        });

        return a;
    }

    toString(): string {
        let d = (typeof this.description === 'function'? this.description() : this.description);
        return Array.isArray(d)? d.reduce((prev, curr) => { return prev + '<p>' + curr + '</p>'}, '') : d;
    }

    after?(verb:string): pgAdvLibExitcode { return pgAdvLibExitcode.continue };
    before?(verb:string): pgAdvLibExitcode { return pgAdvLibExitcode.continue };
}