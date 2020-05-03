import { pgAdvApp } from "../../../pg-adv-app";
import { pgAdvLibText, pgAdvLibPushCmd, pgAdvLibExitcode, pgAdvLibActionInfo, pgAdvLibParsingPhase } from "../pg-adv-lib-defs";
import { pgAdvLibObject } from "../pg-adv-lib-object";
import { pgAdvParser } from "./pg-adv-parser";

let self;

export const pgAdvEngineNoError = '';
export const pgAdvEngineStopped = 'engine not started';

export class pgAdvEngine {

    protected _stopped : boolean = true;
    protected _playerID: string;
    protected _stdlib  : string = 'it-IT';

    constructor(
        protected _advApp: pgAdvApp,
    ) {
        self = this;
    }

    get stopped() {
        return this._stopped;
    }

    protected _resolve(value: pgAdvLibPushCmd) {
        let err = self.eng_next(value);

        if(err) return self.stop(err);
        
        self._loop();
    }

    protected _loop() {
        this._advApp.gui.loop().then(this._resolve);
    }

    eng_start() {
        if(this._advApp.story && this._advApp.story.init) {
            this._advApp.gui.clickFunc = this._resolve;
            this._stopped = false;
            try {
                this._advApp.story.init();
                if((this._advApp.story.objects === undefined)||(Object.keys(this._advApp.story.objects).length === 0)) throw "no story objects defined";
            } catch (error) {
                return this.eng_stop(error);  
            };
            this._loop();
        }
        else this.eng_stop('no story definition available');
    }

    eng_messages(info: pgAdvLibActionInfo): string {
        if(!this._advApp.story.messages) throw "Messages not found. Please, set story messages"

        if (info.parser == pgAdvLibParsingPhase.verb) return this._advApp.story.messages.parseVerbNotFound;
        if (info.parser == pgAdvLibParsingPhase.action) return this._advApp.story.messages.parseActionNotFound;
        if (info.parser == pgAdvLibParsingPhase.noun) return this._advApp.story.messages.parseNounNotFound;

        return "Message not available for this situation";
    }

    eng_parse(cmdValue: pgAdvLibPushCmd) {
        let parser = new pgAdvParser(this._advApp.story);
        let info = parser.parse(cmdValue);

        if(!info) throw "Parser error: field 'info' not available";

        if(info.action) info.action.func(info);
        else this.gui_print_ret(this.eng_messages(info) + ': ' + cmdValue.tokens.join(' '));
    }

    eng_next(cmdValue: pgAdvLibPushCmd) {
        if(this._stopped) return pgAdvEngineStopped;

        if(cmdValue.options.echo) this.gui_print_ret('>' + cmdValue.tokens.join(" ") + '<br>');

        this.eng_parse(cmdValue);

        //evaluating story progress: delete next source row
        //this._advApp.gui.addBlock('tokens: <b>'+ cmdValue.tokens.length + '</b>. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque accumsan arcu sed felis <adv-l>porttitor</adv-l> mollis. Integer consectetur dignissim odio ut consectetur. Vestibulum sit amet nibh in quam malesuada elementum. Donec commodo semper dui ac consectetur. Cras in tellus at est hendrerit semper. Pellentesque vitae auctor urna. Sed pulvinar finibus erat eget ornare. Quisque placerat fringilla neque, at bibendum nulla vehicula in. Sed vestibulum velit at lacus vulputate, vel ultricies orci efficitur.');
    }

    eng_stop(err: any) {
        this._stopped = true;

        this._advApp.gui.addBlock('<b>Bye bye</b>');
        return this._advApp.quit(err);
    }

    obj_object(objID: string): pgAdvLibObject {
        if (!this.obj_checkID(objID)) throw 'no object found with the given id (' + objID + ')';
        return ((objID && this._advApp.story.objects)? this._advApp.story.objects[objID] : undefined);
    }

    obj_parent(objID: string): pgAdvLibObject {
        let obj = this.obj_object(objID);
        return (obj? this.obj_object(obj.parent): undefined);
    }

    obj_description(obj: string | pgAdvLibObject): pgAdvLibText {
        let o = (typeof obj === 'string'? this.obj_object(obj) : obj);
        return ((o && o.description)? (typeof o.description === 'function'? o.description(): o.description): '');
    }

    obj_checkID(objID: string): boolean {
        return ((objID)&&(this._advApp.story)&&(this._advApp.story.objects)&&(this._advApp.story.objects[objID] !== undefined));
    }

    obj_moveTo(objToMoveID: string, toID: string) {
        if(objToMoveID === toID) throw "an object can't move to it self (" + objToMoveID + ')';

        let obj = this.obj_object(objToMoveID);
        let toObj = this.obj_object(toID);

        if((obj)&&(toObj)) obj.parent = toID;
    }

    set sto_location(objID: string) {
        if(this._playerID === undefined) throw "before setting the location you have to set the player's id (i.e. 'player')";

        let obj = this.obj_object(this._playerID);
        if(obj) this.obj_object(this._playerID).parent = objID;
    }

    get sto_location(): string {
        return this.obj_object(this._playerID).parent;
    }

    set sto_player(objID: string) {
        let obj = this.obj_object(objID);
        this._playerID = objID
    }

    get sto_player(): string {
        return this._playerID;
    }

    set gui_footer(s: string) {
        this._advApp.gui.footer = s;
    }

    set gui_title(s: string) {
        this._advApp.gui.title = s;
    }

    gui_hideCmdLine() {
        this._advApp.gui.hideCmdline(true);
    }

    gui_showCmdLine() {
        this._advApp.gui.hideCmdline(false);
    }

    gui_print(text: pgAdvLibText): pgAdvLibExitcode {
        this._advApp.gui.writeText(text);
        return pgAdvLibExitcode.continue;
    }

    gui_print_ret(text: pgAdvLibText): pgAdvLibExitcode {
        this._advApp.gui.writeText(text, { cr: true });
        return pgAdvLibExitcode.stop;
    }

    gui_print_intro(intro: pgAdvLibText, pause: { prompt: string, cmd: string }) {
        this._advApp.gui.hideCmdline();
        this._advApp.gui.writeText(intro, { cr: true, continue: pause });
    }
}
