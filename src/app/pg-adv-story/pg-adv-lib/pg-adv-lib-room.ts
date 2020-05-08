import { pgAdvLibObjectDef, pgAdvLibObject } from "./pg-adv-lib-object";

export interface pgAdvLibRoomDef extends pgAdvLibObjectDef {
    
}

export class pgAdvLibRoom extends pgAdvLibObject implements pgAdvLibRoomDef {

    constructor(config?: pgAdvLibRoomDef) {
        super(config);
    }

}