import { pgAdvLibObjectDef, pgAdvLibObject } from "./pg-adv-lib-object";

export interface pgAdvLibRoomExitsDef {
    north    : string | pgAdvLibRoom;
    south    : string | pgAdvLibRoom;
    east     : string | pgAdvLibRoom;
    west     : string | pgAdvLibRoom;
    northeast: string | pgAdvLibRoom;
    northwest: string | pgAdvLibRoom;
    southeast: string | pgAdvLibRoom;
    southwest: string | pgAdvLibRoom;
    up       : string | pgAdvLibRoom;
    down     : string | pgAdvLibRoom;
    into     : string | pgAdvLibRoom;
    outto    : string | pgAdvLibRoom;
}

export interface pgAdvLibRoomDef extends pgAdvLibObjectDef {
    exits?: Partial<pgAdvLibRoomExitsDef>;
}

export class pgAdvLibRoom extends pgAdvLibObject implements pgAdvLibRoomDef {

    exits?: Partial<pgAdvLibRoomExitsDef>;

    constructor(config?: pgAdvLibRoomDef) {
        super(config);
    }

}