import { rulesXX } from '../../../../../lang/rulesXX';

export const pgAdvParserRulesName = 'pgAdvParserRuleRules';

export const pgAdvParserRulesStubs = String.raw `
{
    var compassValues = {
        north    : ['nord', 'n'],
        south    : ['sud', 's'],
        east     : ['est', 'e'],
        west     : ['ovest', 'o'],
        northeast: ['nordest', 'ne'],
        northwest: ['nordovest', 'no'],
        southeast: ['sudest', 'se'],
        southwest: ['sudovest', 'so'],
        up       : ['su', 'sopra', 'alto', 'a'],
        down     : ['giù', 'sotto', 'basso', 'b'],
        into     : ['dentro', 'in'],
        outto    : ['fuori'],
    };
    
    var pgAdvParserHelperInstance = {
    	_inlineCmp: [],
        noun: function (noun) { return noun },
        held: function (held) { return held },
        creature: function (creature) { return creature },
        multi: function (multi) { return multi },
        multiHeld: function (mh) { return mh },
        multiExcept: function (me) { return me },
        multiInside: function (mi) { return mi },
        topic: function (topic) { return topic },
        special: function (sp) { return sp },
        setInlineCmp: function (cmp) {
        	//this._inlineCmp = this._inlineCmp.concat(c.replace(/"/g, '').split(/[ ]*\/[ ]*/));
	        this._inlineCmp = this._inlineCmp.concat(cmp.split(/[ ]*\/[ ]*/).filter((c) => { return c.search(/"/) >= 0 }).map(el => el.replace(/"/g, '')));
    	    //console.log('SET', this._inlineCmp, cmp);
        	return true;
        },
        inlineSkip: function (w) {
        	let res = ((this._inlineCmp.length > 0) && (this._inlineCmp.findIndex((e) => (e === w)) >= 0));
        	//console.log('SKIP', this._inlineCmp, w, res);
        	return res;
        },
		resetInlineCmp: function () { 
        	this._inlineCmp = []; 
            return true; 
        },
        actor: function (act) {
        	return (act && act.noun) || "player";
    	},
        compass: function (noun) {
            var res;
    
            if(typeof noun === 'object') noun = noun.noun;

            for (const key in compassValues) {
                if (compassValues.hasOwnProperty.call(compassValues, key)) {
                    const element = compassValues[key];
                    if ((Array.isArray(element)) && (element.indexOf(noun) >= 0)) {
                        res = key;
                        break;
                    }
                }
            }
            
            return res;
		},
        actionCheck: function (params) { return true },
        createAction: function (params) { return params },
    }  
}

`

export const pgAdvParserRulesBase = String.raw `

start = ${pgAdvParserRulesName}

/*
 * INFORM'S TOKENS LIKE RULES
 */    
Number = num:(Float / Integer) { return _number(num) }

Actor = act:(Noun "," _* ) { return act[0] }

Noun = noun:Obj { return pgAdvParserHelperInstance.noun(noun) }

Held = held:Obj { return pgAdvParserHelperInstance.held(held) }
    
Creature = creature:Obj { return pgAdvParserHelperInstance.creature(creature) }
    
Multi = multi:List { return pgAdvParserHelperInstance.multi(multi) }

MultiHeld = mh:List { return pgAdvParserHelperInstance.multiHeld(mh) }
    
MultiExcept = me:List { return pgAdvParserHelperInstance.multiExcept(me) }
    
MultiInside = mi:List { return pgAdvParserHelperInstance.multiInside(mi) }

Special = sp:(Cit / Topic / Number) { return pgAdvParserHelperInstance.special(sp) }

/*
 * GENERAL RULES
 */
Punctuation = [,;.:!?]

Blanks = [ \t\n\r']

Word = chars: [a-zA-Zàáäèéëìíïòóöùúü\-\'\^]+ { return chars.join("") }
    
Cit = ["] cit:( Punctuation / Word / Integer / Blanks )* ["] { return cit.join("") }

Float = float:(Integer DecimalSep Integer) { return parseFloat(float.join("")) }

Integer = digits: [0-9]+ { return parseInt(digits.join("")) }

_ "whitespace" = Blanks+

Token = _* t:(!(Prep) w:Word Punctuation? ! {return pgAdvParserHelperInstance.inlineSkip(w)} { return w }) _* { return t }

Topic = topic:(Token+ / Cit) { return pgAdvParserHelperInstance.topic(topic.join(" ")) }

Skip = Conj / ("," _*) / Art

Obj = _* (Skip)* o:(el:(!(Prep/Art/Conj) w:(Word / Cit) ! {return pgAdvParserHelperInstance.inlineSkip(w)}) _* { return Array.isArray(el)?el.join(""): el })+ { return o.join(" ")}

List = Obj+

`;

export function pgAdvParserRulesLang(lang: string) {
    return `

/***********************************************
 * 
 * CUSTOM LANG RULES
 * Language: ${lang}
 * 
 ***********************************************/

${rulesXX[lang]}
`;
}
