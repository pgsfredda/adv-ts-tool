import { pgAdvLibVerb } from "./pg-adv-lib-verb";

export class pgAdvLibVerbList {
    protected _verbs: Array<pgAdvLibVerb>;

    constructor(v?: Array<pgAdvLibVerb>) {
        this.list = (v?v:[]);
    }

    set list(v: Array<pgAdvLibVerb>) {
        this._verbs = v;
    }

    get list(): Array<pgAdvLibVerb> {
        return this._verbs;
    }

    concat(v : Array<pgAdvLibVerb>) {
        this._verbs = this._verbs.concat(v);
    }
    
    //put here verbs list operation (push, insert, update, delete)
}
