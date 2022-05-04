import { pgAdvParser } from "./pg-adv-parser";
import { pgAdvLibActionInfo } from "../../pg-adv-lib-defs";
import { pgAdvParserHelperInterface } from "./pg-adv-parser-helper.interface";
import { pgAdvLibBase } from "../../pg-adv-lib-base";
import { pgAdvLibVerbList } from "../../pg-adv-lib-verb-list";
import { pgAdvLibObjectDef } from "../../pg-adv-lib-object";
import { pgAdvLibStoryDef } from "../../pg-adv-lib-story-def";


export class pgAdvParserHelper extends pgAdvLibBase implements pgAdvParserHelperInterface {

    protected _inlineCmp: Array<any> = [];
    protected _curr: Partial<pgAdvLibActionInfo>;
    protected _last: Partial<pgAdvLibActionInfo>;

    constructor(
        protected _parser: pgAdvParser
    ){
        super('ParserHelper');
    }

    protected _resetCurr(): Partial<pgAdvLibActionInfo> {
        this._last = this._curr;
    
        this._curr = {
            actor: undefined,
            verb: undefined,
            action: undefined,
            noun: undefined,
            second: undefined,
            options: undefined
        };
    
        return this._curr;
    }

    protected _tokenCheck(field: string, params: Partial<pgAdvLibActionInfo>): boolean {
        let token = Object.keys(params[field])[0];
        let options = { field, token };

        //console.log('_tokenCheck', options, params);

        switch (token) {
            case 'noun':
                return this._singleCheck(params, options);
            case 'held':
                options = Object.assign(options, { held: true });
                return this._singleCheck(params, options);
            case 'creature':
                return this._creatureCheck(params, options);
            case 'number':
            case 'topic':
            case 'special':
                return true;
            case 'multi':
                return this._multiCheck(params, options);
            case 'multiInside':
                options = Object.assign(options, { inside: params.second.noun });
                return this._multiCheck(params, options);
            case 'multiHeld':
                options = Object.assign(options, { held: true });
                return this._multiCheck(params, options);
            case 'multiExcept':
                options = Object.assign(options, { except: params.second.noun });
                return this._multiCheck(params, options);
            default:
                return false;
        }
    }

    protected _singleCheck(params: Partial<pgAdvLibActionInfo>, options): boolean {
        let res = this._parser.objInScope(params.actor, params[options.field][options.token], options);
    
        if (!res) this._parser.setErr({ errno: options.held ? 'NOTHELD_PE' : 'CANTSEE_PE', value: this._parser.getErrValue(params, options) });
    
        //console.log(`_singleCheck {field: ${options.field}, token: ${options.token}} ${res?'TRUE': 'FALSE'}`, { params, options, res, err });
    
        return res;
    }

    protected _attrCheck(params: Partial<pgAdvLibActionInfo>, attr): boolean {
        let res: boolean;
        let objs: pgAdvLibStoryDef;
    
        if ((params.actor) && (params.noun) && (attr)) objs = this._parser.getObjsInScope(params.actor);
    
        res = ((objs) && (objs[params.noun.noun]) && (objs[params.noun.noun][attr]));
    
        if (!res) this._parser.setErr({ errno: !objs[params.noun.noun] ? 'CANTSEE_PE' : 'NOTHING_PE', value: this._parser.getErrValue(params, { data: params.noun.noun, attr: objs[params.noun.noun] ? attr : undefined }) });
    
        //console.log(`_attrCheck {actor: ${params.actor}, noun: ${JSON.stringify(params.noun)}, obj: ${JSON.stringify(objs[params.noun.noun])}, attr: ${attr}} ${res?'TRUE': 'FALSE'}`, { parsingErr });
    
        return res;
    }
    
    protected _multiCheck(params: Partial<pgAdvLibActionInfo>, options): boolean {
        let tmp = this._parser.filterObjsInList(params, params.noun[options.token], options);
        if (tmp && tmp.length > 0) {
            params.noun[options.token] = tmp;
            //console.log(`_multiCheck {field: ${options.field}, token: ${options.token}} TRUE`, { params, options, tmp, parsingErr });
            return true;
        }
    
        //console.log(`_multiCheck {field: ${options.field}, token: ${options.token}} FALSE`, { params, options, tmp, parsingErr });
        //console.log(`_multiCheck {field: ${options.field}, token: ${options.token}} FALSE`, { params, options, tmp });
    
        return false;
    }
    
    protected _creatureCheck(params: Partial<pgAdvLibActionInfo>, options): boolean {
        if (this._singleCheck(params, options)) {
            let objs = this._parser.getObjsInScope(params.actor);
            let creature = params[options.field][options.token];
            return ((objs) && (objs[creature]) && (objs[creature]['creature']));
        }
    
        return false;
    }

    verbsCheck(lastVerb: string, verbs: pgAdvLibVerbList): boolean {
        if (!lastVerb) return true;
    
        let found = false;
        let i = 0;
    
        while ((!found) && (i < verbs.list.length)) {
            found = (verbs[i].words.indexOf(lastVerb) >= 0);
            i++;
        }
    
        if (!found) {
            this._parser.setErr({ errno: 'VERB_PE', value: {verb: lastVerb} });
            return false;
        }
    
        return true;
    }

    actionCheck(params: Partial<pgAdvLibActionInfo>): boolean {

        //console.log('_actionCheck', params.actor, params.verb, params.action, params.noun, params.second);
    
        if (!params.noun) { return true }
    
        if ((params.second) && (!this._tokenCheck('second', params))) return false;
    
    
        return this._tokenCheck('noun', params);
    }

    createAction(params: Partial<pgAdvLibActionInfo>): {} {
        this._last = this._curr;
        this._curr = params;
    
        return this._curr;
    }
    
    resetInlineCmp(): boolean {
        //console.log('RESET');
        this._inlineCmp = [];
        return true;
    }
    
    inlineSkip(w: string): boolean {
        let res = ((this._inlineCmp.length > 0) && (this._inlineCmp.findIndex((e) => (e === w)) >= 0));
        //console.log('SKIP', this._inlineCmp, w, res);
        return res;
    }
    
    setInlineCmp(cmp: string): boolean {
        //this._inlineCmp = this._inlineCmp.concat(c.replace(/"/g, '').split(/[ ]*\/[ ]*/));
        this._inlineCmp = this._inlineCmp.concat(cmp.split(/[ ]*\/[ ]*/).filter((c) => { return c.search(/"/) >= 0 }).map(el => el.replace(/"/g, '')));
        //console.log('SET', this._inlineCmp, cmp);
        return true;
    }
    
    special(special: string): {} {
        return { special };
    }
    
    number(number: string): {} {
        return { number };
    }
    
    noun(noun: string): {} {
        return { noun };
    }
    
    held(held: string): {} {
        return { held };
    }
    
    topic(topic: string): {} {
        return { topic };
    }
    
    creature(creature: string): {} {
        return { creature };
    }
    
    multi(multi: string): {} {
        return { multi };
    }
    
    multiHeld(multiHeld: string): {} {
        return { multiHeld };
    }
    
    multiExcept(multiExcept: string): {} {
        return { multiExcept };
    }
    
    multiInside(multiInside: string): {} {
        return { multiInside };
    }
    
    actor(act: any): {} {
        return (act && act.noun) || "player";
    }

    compass(noun) {
        //console.log(`compass function activated with ${noun.noun} parameter = ${this._parser.getCompass(noun)}`);
        return this._parser.getCompass(noun);
    }

};
