import { pgAdvApp } from "../../../pg-adv-app";
import { pgAdvLibText, pgAdvLibPushCmd, pgAdvLibExitcode, pgAdvLibParserResult, pgAdvLibLinkData } from "../pg-adv-lib-defs";
import { pgAdvParser } from "./pg-adv-parser/pg-adv-parser";
import { pgAdvLibBase } from "../pg-adv-lib-base";

let self;

export const pgAdvEngineNoError = '';
export const pgAdvEngineStopped = 'engine not started';

export class pgAdvEngine extends pgAdvLibBase {

    protected _stopped : boolean = true;
    protected _parser  : pgAdvParser;

    constructor(
        protected _advApp: pgAdvApp,
    ) {
        super('Engine');
        self = this;
    }

    get stopped() {
        return this._stopped;
    }

    protected _resolve(value: pgAdvLibPushCmd) {
        let err = self.next(value);

        if(err) throw err;
        
        self._loop();
    }

    protected _loop() {
        this._advApp.gui.loop().then(this._resolve);
    }

    getError(mess: string = '') {
        this.stop(this.getInternalError()); 
        return super.getError(mess);
    }

    start() {
        if(this._advApp.story && this._advApp.story.init) {
            this._advApp.gui.clickFunc = this._resolve;
            this._stopped = false;
            try {
                this._advApp.story.init();
                this._parser = new pgAdvParser(this._advApp.story);
                this._loop();
                //if((this._advApp.story.objects === undefined)||(Object.keys(this._advApp.story.objects).length === 0)) throw "no story objects defined";
            } catch (error) {
                return this.stop(error);  
            };
        }
        else this.stop('no story definition available');
    }

    stop(err: any) {
        this._stopped = true;

        this._advApp.gui.addBlock(this._advApp.story.messages.appQuit);
        this._advApp.gui.clickFunc = undefined;

        return this._advApp.quit(err);
    }

    messages(res: pgAdvLibParserResult): string {
        if(!this._advApp.story.messages) throw this.getError("Messages not found. Please, set story messages");

        // put here messages settings about info values

        if(res.warn && res.warn.errno !== 'NO_PE') {
            //console.warn(this._context, res);
            switch (res.warn.errno) {
                case 'GENERIC_PE':
                    return this._advApp.story.messages.parseNoMeaning(res.sentence);
                case 'CANTSEE_PE':
                    return this._advApp.story.messages.parseNotSeen(res.warn.value.data);
                case 'NOTHELD_PE':
                    return this._advApp.story.messages.parseNotHeld(res.warn.value.data);
                default:
                    return this._advApp.story.messages.parseNoMeaning(res.sentence);
            }
        }

        if(!res.info.action) return this._advApp.story.messages.parseActionNotFound;

        return "Message not available for this situation";
    }

    parse(cmdValue: pgAdvLibPushCmd) {
        let res : pgAdvLibParserResult;

        try {
            res = this._parser.parse(cmdValue);    
        } catch (error) {
            throw this.getError("Parser error: " + error);
        }

        if(!res || !res.info) throw this.getError("Parser error: field 'res' or 'info' not available");

        if(res.info.action) {
            if(!this._advApp.story.actions[res.info.action]) throw this.getError(`Action error: '${res.info.action}' not defined or not found in the story`);
            else this._advApp.story.actions[res.info.action].func(res.info);
        }
        else this.gui.print_ret(`${this.messages(res)}`);
    }

    next(cmdValue: pgAdvLibPushCmd) {
        if(this._stopped) return pgAdvEngineStopped;

        if((cmdValue.options.echo) && (!this.gui.getIsHiddenCmdLine())) {
            this.gui.print_ret('>' + cmdValue.sentence + '<br>');
            this.parse(cmdValue);
        }
        else if(!cmdValue.options.echo)
            this.parse(cmdValue);

        //evaluating story progress: delete next source row
        //this._advApp.gui.addBlock('tokens: <b>'+ cmdValue.tokens.length + '</b>. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque accumsan arcu sed felis <adv-l>porttitor</adv-l> mollis. Integer consectetur dignissim odio ut consectetur. Vestibulum sit amet nibh in quam malesuada elementum. Donec commodo semper dui ac consectetur. Cras in tellus at est hendrerit semper. Pellentesque vitae auctor urna. Sed pulvinar finibus erat eget ornare. Quisque placerat fringilla neque, at bibendum nulla vehicula in. Sed vestibulum velit at lacus vulputate, vel ultricies orci efficitur.');
    }

    /**
     * Engine gui handling methods family
     *
     * @memberof pgAdvEngine
     */
    gui = {

        clearLinks: () => {
            this._advApp.gui.clearLinks();
        },

        setFooter: (s: string) => {
            this._advApp.gui.footer = s;
        },

        setTitle: (s: string) => {
            this._advApp.gui.title = s;
        },

        hideCmdLine: () => {
            this._advApp.gui.hideCmdline(true);
        },

        showCmdLine: () => {
            this._advApp.gui.hideCmdline(false);
        },

        getIsHiddenCmdLine: (): boolean => {
            return this._advApp.gui.isHiddenCmdline;
        },

        print: (text: pgAdvLibText): pgAdvLibExitcode => {
            this._advApp.gui.writeText(text);
            return pgAdvLibExitcode.continue;
        },

        print_ret: (text: pgAdvLibText): pgAdvLibExitcode => {
            this._advApp.gui.writeText(text, { cr: true });
            return pgAdvLibExitcode.stop;
        },

        print_intro: (intro: pgAdvLibText, pause: pgAdvLibLinkData) => {
            this._advApp.gui.hideCmdline();
            this._advApp.gui.writeText(intro, { continue: pause });
        }
    
    };

}
