import { pgAdvLibExitcode, pgAdvLibText, pgAdvLibObjectFunc, pgAdvLibObjectAttributes, pgAdvLibItemsData } from "./pg-adv-lib-defs";
import { pgAdvLibToken } from "./pg-adv-lib-token";

export class pgAdvLibObjectDef {
    ID          : string;
    external    ?: string;
    description ?: pgAdvLibText | pgAdvLibObjectFunc ;
    name        ?: Array<string>;
    attributes  ?: pgAdvLibObjectAttributes;
    float       ?: Array<string>;
}

export class pgAdvLibObject extends pgAdvLibObjectDef {

    protected _parent?: pgAdvLibObject;
    protected _name?  : Array<pgAdvLibToken> = [];
 
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

    set parent(parent: pgAdvLibObject) {
        this._parent = parent;
        this._parent[this.ID] = this;
    }

    get parent() {
        return this._parent;
    }

    toString(): string {
        let d = (typeof this.description === 'function'? this.description() : this.description);
        //return Array.isArray(d)? d.reduce((prev, curr) => { return prev.toString() + '<p>' + curr + '</p>'}, '') : d;
        return '';
    }

    after?(verb:string): pgAdvLibExitcode { return pgAdvLibExitcode.continue };
    before?(verb:string): pgAdvLibExitcode { return pgAdvLibExitcode.continue };
}