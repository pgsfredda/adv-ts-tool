import { pgAdvLibPushCmd, pgAdvLibActionInfo, pgAdvLibParsingPhase, pgAdvParsingContext } from "../pg-adv-lib-defs";
import { pgAdvStory } from "./pg-adv-story";
import { pgAdvLibVerb } from "../pg-adv-lib-verb";

export class pgAdvParser {

    protected _tokens: string[];
    protected _tokensIdx: number = 0; 
    protected _parsePhase: pgAdvLibParsingPhase;

    constructor(protected _story: pgAdvStory) {};

    protected _init(tokens: string[]){
        this._tokens = tokens;
        this._parsePhase = pgAdvLibParsingPhase.init;
    };

    protected _end(info: pgAdvLibActionInfo): pgAdvLibActionInfo {
        info = info || { action: undefined};
        info.parser = this._parsePhase;
        return info;
    }

    protected _getVerb(token): pgAdvLibVerb {
        return this._story.verbs.find(v => v.name.findIndex(n => n === token)> -1);
    }

    protected _getNounDomain(token, domain1, domain2, context: pgAdvParsingContext) {
        let res;
        return res;
    }

    protected get _tokensLength(): number {
        return (this._tokens || []).length;
    }

    protected get _tokensCurr(): string {
        return ((this._tokens || [])[this._tokensIdx]) || '';
    }

    parse(cmdValue: pgAdvLibPushCmd): pgAdvLibActionInfo {
        let res: pgAdvLibActionInfo;
        let verb: pgAdvLibVerb;

        this._parsePhase = pgAdvLibParsingPhase.init;
        this._init(cmdValue.tokens);

        if(this._tokensLength == 0 ) this._end(res);

        this._parsePhase = pgAdvLibParsingPhase.verb;
        verb = this._getVerb(this._tokensCurr);
        if(verb) {
            this._parsePhase = pgAdvLibParsingPhase.action;
            if(verb.patterns[0]) {    
                res = {action: this._story.actions[verb.patterns[0].action]};
                if(res.action) this._parsePhase = pgAdvLibParsingPhase.complete;
            }
        }
        else {
            this._parsePhase = pgAdvLibParsingPhase.noun;
            let nounRes = this._getNounDomain(this._tokensCurr, 'compass', undefined, pgAdvParsingContext.noun);
            if(nounRes) {
                this._parsePhase = pgAdvLibParsingPhase.compass;
                if(this._story.actions['go']){
                    this._tokensIdx++;
                    res = {action: this._story.actions['go'], noun: this._tokensCurr};
                }
            }
        }
        return this._end(res);
    }

    get phase(): pgAdvLibParsingPhase {
        return this._parsePhase;
    }

}