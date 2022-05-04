import { pgAdvLibText, pgAdvLibMessages, pgAdvLibCollectionType } from "../pg-adv-lib-defs";
import { pgAdvEngine } from "./pg-adv-engine";
import { pgAdvLibObject } from "../pg-adv-lib-object";
import { pgAdvLibBase } from "../pg-adv-lib-base";
import { pgAdvLibStoryDef } from "../pg-adv-lib-story-def";
import { pgAdvLibVerbList } from "../pg-adv-lib-verb-list";
import { pgAdvLibRoom } from "../pg-adv-lib-room";
import { pgAdvLibCompass } from "../pg-adv-lib-compass";
import { getPropName, getAdvSimpleLink } from "../pg-adv-utils";
import { pgAdvLibCharacter } from "../pg-adv-lib-character";

export abstract class pgAdvStory extends pgAdvLibBase {
    protected _playerID: string;
    protected _engine  : pgAdvEngine;

    rooms       : pgAdvLibStoryDef;
    objects     : pgAdvLibStoryDef;
    actions     : pgAdvLibStoryDef;
    characters  : pgAdvLibStoryDef;

    
    serial      : string;
    author      : string;
    authorSite  : string;
    copywrite   : string;
    introduction: pgAdvLibText;
    footer      : pgAdvLibText;
    title       : string;
    version     : string;

    constructor(
        public lang    : string,
        public messages: pgAdvLibMessages,
        public compass : pgAdvLibCompass,
        public verbs   : pgAdvLibVerbList,
    ) {
        super('Story');
    }
    
    abstract init();

    set engine(eng: pgAdvEngine) {
        this._engine = eng;
    }

    get engine(): pgAdvEngine {
        if(!this._engine) throw this.getError('no engine initializated');
        return this._engine;
    }

    getError(mess: string = '') {
        this.engine.stop(this.getInternalError()); 
        return super.getError(mess);
    }

    object(objID: string, collection: pgAdvLibCollectionType): pgAdvLibObject {
        if (!this.checkID(objID, collection)) throw this.getError(`no object found with the given id '${objID}' in collection '${collection}'`);
        return this[collection][objID];
    }

    parent(objID: string, objColl: pgAdvLibCollectionType, parentColl: pgAdvLibCollectionType): pgAdvLibObject {
        let obj = this.object(objID, objColl);
        return (obj? obj.parent: undefined);
    }

    description(obj: string | pgAdvLibObject, collection: pgAdvLibCollectionType): pgAdvLibText {
        let o = (typeof obj === 'string'? this.object(obj, collection) : obj);
        return ((o && o.description)? (typeof o.description === 'function'? o.description(): o.description): '');
    }

    exits(room: string | pgAdvLibRoom): pgAdvLibText {
        if(typeof room === 'string') room = this.object(room, 'rooms');
        if(room && room.exits) return Object.keys(room.exits).reduce((p, c) => ((p? p + this.messages.storyExitsCurr: this.messages.storyExitsInit) + getAdvSimpleLink(this.compass.getCompassWorld(c))), '')
    }

    getExit(exit: string | pgAdvLibRoom): pgAdvLibRoom {
        if(!exit) return undefined;

        return (exit instanceof pgAdvLibRoom? exit: this.object(exit, 'rooms'));
    }

    objs(room: string | pgAdvLibRoom): pgAdvLibText {
        if(typeof room === 'string') room = this.object(room, 'rooms');
        if(room) return Object.keys(room).reduce((p, c) => {
            let visible = ((room[c] instanceof pgAdvLibObject)&&(c !== this.playerID));
            let items = (arr: Array<string>, name: string) => {
                return arr.map((c) => { return {label: c, value: c + ' ' + name}})
            }
            let obj = (curr: string) => {
                if(room[curr] instanceof pgAdvLibObject && room[curr].float) return getAdvSimpleLink(curr, items(room[curr].float, curr));
                else return getAdvSimpleLink(curr, 'x ' + curr);
            }
            return p? p + (visible?this.messages.storyObjsCurr + obj(c): ''): (visible?this.messages.storyObjsInit + obj(c): '');            
        }, '')
    }

    checkID(objID: string, collection: pgAdvLibCollectionType): boolean {
        return ((objID)&&(this[collection])&&(this[collection][objID] !== undefined));
    }

    moveTo(objToMoveID: string, toID: string, objToMoveColl: pgAdvLibCollectionType = 'objects', toColl: pgAdvLibCollectionType = 'objects') {
        if(objToMoveID === toID) throw this.getError(`an object can't move to it self (${objToMoveID})`);

        let obj = this.object(objToMoveID, objToMoveColl);
        let toObj = this.object(toID, toColl);

        //console.log('moveTo', obj, toObj);

        if((obj)&&(toObj)) obj.parent = toObj
        else throw this.getError(`obj to move (${objToMoveID} in ${objToMoveColl}) or target object (${toID} in ${toColl}) not defined`);
    }

    set locationID(objID: string) {
        if(this._playerID === undefined) throw this.getError("before setting the location you have to set the player's id (i.e. 'player')");

        this.moveTo(this._playerID, objID, 'characters', 'rooms');
    }

    get locationID(): string {
        return this.object(this._playerID, 'characters').parent.ID;
    }

    get location(): pgAdvLibRoom {
        return this.object(this.locationID, 'rooms');
    }

    set location(location: pgAdvLibRoom) {
        if(!location) throw this.getError("no new location is given");

        this.locationID = location.ID;
    }

    set playerID(objID: string){
        let obj = this.object(objID, 'characters');
        this._playerID = (obj? objID : undefined);
    }

    get playerID(): string {
        return this._playerID;
    }

    get player(): pgAdvLibObject {
        return this.object(this._playerID, 'characters');
    }

    getActorName(actor: string) {
        return actor === 'player'? this.playerID: actor;
    }

}