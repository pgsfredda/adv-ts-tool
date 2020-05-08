import { pgAdvLibObjectDef, pgAdvLibObject } from "./pg-adv-lib-object";

export interface pgAdvLibCharacterDef extends pgAdvLibObjectDef {
    
}

export class pgAdvLibCharacter extends pgAdvLibObject implements pgAdvLibCharacterDef {

    constructor(config?: pgAdvLibCharacterDef) {
        super(config);
    }

}