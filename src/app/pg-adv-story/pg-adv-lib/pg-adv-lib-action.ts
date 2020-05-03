import { pgAdvLibActionFunc } from "./pg-adv-lib-defs";

export class pgAdvLibActionDef {
    func: pgAdvLibActionFunc;
}

export class pgAdvLibAction extends pgAdvLibActionDef {

    constructor(config?: pgAdvLibActionDef) {
        super();
        if(config) Object.assign(this, config);
    }
}