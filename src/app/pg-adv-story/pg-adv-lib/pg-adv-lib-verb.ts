import { pgAdvLibToken } from "./pg-adv-lib-token";
import { pgAdvLibAction } from "./pg-adv-lib-action";
import { pgAdvLibPattern } from "./pg-adv-lib-pattern";

export class pgAdvLibVerbDef {
    name?       : Array<string>;
    patterns?   : Array<pgAdvLibPattern> = [];
}

export class pgAdvLibVerb extends pgAdvLibVerbDef {

    protected _name?: Array<pgAdvLibToken> = [];
 
    constructor(config?: pgAdvLibVerbDef) {
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

    toString() {
        return this.name.join('/');
    }
}