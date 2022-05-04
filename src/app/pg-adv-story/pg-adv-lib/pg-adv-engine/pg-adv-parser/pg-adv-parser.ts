import { pgAdvLibPushCmd, pgAdvLibActionInfo, pgAdvLibParserError, pgAdvLibParserResult } from "../../pg-adv-lib-defs";
import { pgAdvStory } from "../pg-adv-story";

declare var peg;
declare var createParserHelper;

import { pgAdvParserRulesName, pgAdvParserRulesStubs, pgAdvParserRulesBase, pgAdvParserRulesLang } from "./pg-adv-parser-rules";
import { pgAdvParserRulesHelper } from "./pg-adv-parser-rules-helper";
import { pgAdvLibBase } from "../../pg-adv-lib-base";
import { pgAdvLibObjectDef, pgAdvLibObject } from "../../pg-adv-lib-object";
import { pgAdvLibStoryDef } from "../../pg-adv-lib-story-def";

export class pgAdvParser extends pgAdvLibBase{

    protected _sentence: string;
    protected _parser: any;
    protected _pgAdvParserRules: string;
    protected _parsingErr: pgAdvLibParserError;

    constructor(
        protected _story: pgAdvStory
    ) {
        super('Parser');
        createParserHelper(this);
        this._generateParser();
    };

    protected _generateParser() {
        let rulesVerbs = pgAdvParserRulesHelper.generate(this._story.verbs.list, pgAdvParserRulesName);
        this._pgAdvParserRules = pgAdvParserRulesBase + pgAdvParserRulesLang(this._story.lang) + rulesVerbs;

        //console.info(pgAdvParserRulesStubs + this._pgAdvParserRules.trim());

        try {
            this._parser = peg.generate(this._pgAdvParserRules.trim());    
        } catch (error) {
            this.getError(error);
        }
        
    }

    protected _init(cmdValue: pgAdvLibPushCmd){
        this._sentence = cmdValue.sentence.toLocaleLowerCase();
    };

    protected _end(res: pgAdvLibParserResult): pgAdvLibParserResult {
        res.info = res.info || { action: undefined};
        return res;
    }

    getErrValue(params: Partial<pgAdvLibActionInfo>, options) {
        var res = { actor: params.actor, action: params.action.name };
    
        options = options || {};
    
        var data = (options.data) ? options.data : params[options.field || 'noun'][Object.keys(params[options.field || 'noun'])[0]];
    
        if (!options.clearData) {
            res = Object.assign({}, res, { data });
            if (options.inside) res = Object.assign({}, res, { inside: (options.inside) });
            if (options.attr) res = Object.assign({}, res, { attr: (options.attr) });
        }
    
        return res;
    }
    
    resetErr(err?: pgAdvLibParserError) {
        if (err) this.setErr(err, true);
        else this.setErr({ errno: 'NO_PE', value: undefined }, true);
    
        return this._parsingErr;
    }
    
    setErr(err: pgAdvLibParserError, force = false): pgAdvLibParserError {
        if ((force) || (this._parsingErr.errno === 'GENERIC_PE') || (this._parsingErr.errno === 'NO_PE')) this._parsingErr = Object.assign({}, err);
    
        return this._parsingErr;
    }

    getWorld(actor: string, world: pgAdvLibStoryDef, exclude?: pgAdvLibObject) {
        let res;
    
        //console.log('getWorld ENTRY', actor, world);
    
        if ((actor) && (!Array.isArray(world)) && (typeof world === 'object') && (typeof actor === 'string')) {
            if (this.findObj(actor, world)) res = world;
            else {
                for (const o in world) {
                    if(world[o] && world[o] instanceof pgAdvLibObject && ((world[o] !== exclude && exclude)|| (!exclude))) {
                        //console.log('getWorld LOOP', actor, o, res);
                        res = this.getWorld(actor, world[o], world[o].parent);
                    }
                    if (res) break;
                }
            }
        } else if (!actor) res = world;
    
        //console.log('getWorld EXIT', res);
    
        return res;
    }

    getObjsInScope(actor: string, options?): pgAdvLibStoryDef {

        actor = this._story.getActorName(actor);

        let world = this.getWorld(actor, this._story.rooms);
        var res;

        res = world ? ((options && options.held) ? world[actor] : ((options && options.inside) ? world[options.inside] : Object.assign({}, world, world[actor]))) : undefined;

        //console.log('getObjsInScope', 'actor', actor, 'world', world, 'Objs in scope', res);

        if (res) return res;

        return world;
    }

    getObj(actor: string, objName: string, options) {
        return this.getObjsInScope(actor, options)[objName];
    }

    findObj(objName: string, where) {
        let res: boolean;
    
        if ((!objName) || (!where)) return false;
    
        res = (Object.keys(where).indexOf(objName) >= 0);
    
        //console.log('findObj', objName, where, res);
    
        return res;
    }
        
    objInScope(actor: string, objName: string, options?): boolean {

        if (this.findObj(objName, this.getObjsInScope(actor, options))) return true;
        if (this.getCompass({ noun: objName })) return true;

        return false;
    }

    filterObjsInList(params, list, options?): Array<pgAdvLibObjectDef> {
        let res = list.map(l => l);
        let where = this.getObjsInScope(params.actor, options);

        options = Object.assign({}, options || {}, { data: list });

        //console.log('filterObjsInList', JSON.stringify({ where, list, options, res, parsingErr }));

        if (where) {
            list.forEach(o => {
                if (!this.objInScope(params.actor, o, options)) res.splice(res.indexOf(o), 1);
                //console.log(o, res, objInScope(actor, o));
            });
            if (res.length == 0) {
                this.setErr({ errno: options.held ? 'NOTHELD_PE' : 'CANTSEE_PE', value: this.getErrValue(params, options) });
                //console.log('filterObjsInList exit where', parsingErr);
                return [];
            }
        }

        if ((options) && (options.except)) {
            list.forEach(o => {
                if (options.except === o) res.splice(res.indexOf(o), 1);
            });
            if (res.length == 0) {
                this.setErr({ errno: 'EXCEPT_PE', value: this.getErrValue(params, options) });
                return [];
            }
        }

        if (!where) {
            if (!options)
                this.setErr({ errno: 'TOOLIT_PE', value: this.getErrValue(params, { clearData: true }) });
            else if (options.inside)
                this.setErr({ errno: 'CANTSEE_PE', value: this.getErrValue(params, options) });
            else if (!options.except)
                this.setErr({ errno: 'TOOLIT_PE', value: this.getErrValue(params, { clearData: true }) });
            return []
        }

        //console.log(res);

        return res;
    }

    parse(cmdValue: pgAdvLibPushCmd): pgAdvLibParserResult {
        let info: pgAdvLibActionInfo;
        let res: pgAdvLibParserResult;

        this._init(cmdValue);

        res = { sentence: this._sentence, info: undefined };

        if(this._sentence.length == 0) return this._end(res);

        try {
            this.resetErr();

            let s = this._sentence.split(' ').reduce((p, c) =>  p += (p?' ': '') + c.padEnd(3,'^'), '');

            info = this._parser.parse(s);
            //console.log('Parser:', res);

            if (this._parsingErr.errno !== 'NO_PE') throw { warn: true };

        } catch (error) {
            if(!error.warn && error.name === 'SyntaxError') {
                error = Object.assign(error, { warn: true });
                this.setErr({errno: 'GENERIC_PE', value: error.message});
            }

            error.warn = error.warn || (this._parsingErr.errno !== 'NO_PE');
            error.name = (error.warn ? 'Application Error' : error.name);
            error.details = {
                message: error.message,
                location: error.location,
                data: this._parsingErr,
            }
            error.message = (error.warn ? `${this._parsingErr.errno}${this._parsingErr.value? ': ' + JSON.stringify(this._parsingErr.value): ''}` : `Parsing error thrown (${error.message})`);

            if(!error.warn) throw this.getError(error);
            //console.warn('Parser:',error);

            if(error.warn) res.warn = error.details.data;
        }
        
        res.info = info;
        
        return this._end(res);
    }

    getCompass(noun): string {
        return this._story.compass.getCompass(noun);
    }

}