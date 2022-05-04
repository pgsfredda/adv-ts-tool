import { pgAdvParserTokenTypes } from '../../pg-adv-lib-defs';

export class pgAdvParserRulesHelper {
    static capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
    
    static unduplicate(tokens: string[]| Object[]) {
        var counter = { 'noun': 0, 'number': 0, 'attr': 0, 'special': 0 };
        var singles = { 'multi': 0, 'multiHeld': 0, 'multiExcept': 0, 'multiInside': 0, 'topic': 0, 'funct': 0, 'held': 0, 'creature': 0 };
    
        function counting(t, f) {
            if (t in counter) {
                counter[t]++;
                return t + counter[t] + f;
            }
    
            if (t in singles) {
                if (singles[t] >= 1) throw `Unduplicate error: token "${t}" duplicated; only ${Object.keys(counter).reduce((p, c)=> (p?p +', ':'') + '"' + c + '"', '')} are duplicable in the same pattern`
                else singles[t]++;
                return t + f;
            }
    
            return t;
        }
    
        for (let index = 0; index < tokens.length; index++) {
            var t = tokens[index];
            if (typeof t === 'string') {
                var ta = t.split('=');
                t = ta[0];
                var f = (ta.length > 1 ? '=' + ta[1] : '');
                tokens[index] = counting(t, f);
            } else if ((!Array.isArray(t)) && (typeof t === 'object')) {
                var o = {};
                o[counting(Object.keys(t)[0], '')] = tokens[index][Object.keys(t)[0]];
                tokens[index] = o;
            }
        }
    
        return tokens;
    }
    
    static generateToken(token, action, objs, cmps) {
        let tokenName: string;
        let tokenType: pgAdvParserTokenTypes | string;

        if (typeof token === 'string') {
            var spec = token.split('=');
            tokenName = spec[0];
            tokenType = spec[0].split(/[0-9]/)[0];
            switch (tokenType) {
                case 'noun':
                case 'multi':
                case 'multiExcept':
                case 'multiInside':
                case 'held':
                case 'multiHeld':
                case 'creature':
                case 'number':
                case 'special':
                case 'topic':
                    objs.push(tokenName);
                    return `${tokenName}:${this.capitalizeFirstLetter(tokenType)} ${spec[1]? '& { return pgAdvParserHelperInstance.' + spec[1] + '(' + tokenName + ') } ': ''}`;
                default:
                    cmps.push(`& { return pgAdvParserHelperInstance.setInlineCmp('${tokenName}') }`);
                    return `(${tokenName}) `;
            }
        } else {
            var fld = Object.keys(token)[0];
            tokenName = fld;
            tokenType = fld.split(/[0-9]/)[0];
            switch (tokenType) {
                case 'attr':
                    objs.push(tokenName);
                    return `${tokenName}:${this.capitalizeFirstLetter('noun')} & {return pgAdvParserHelperInstance.${tokenType}Check({actor: pgAdvParserHelperInstance.actor(actor), noun:${tokenName}, action: ${action}}, "${token[tokenName]}")  } `
                case 'funct':
                    objs.push('topic');
                    return `topic:Topic & { return ${token[fld]}(topic) } `
                default:
                    return '***';
            }
        }
    }
    
    static generate(verbs, rulesName) {
        var res = '';
    
        verbs.forEach(v => {
            v.patterns.forEach(p => {
                res += res ? '\t/ ' : '';
                res += `actor:Actor? `;
    
                res += `& { return pgAdvParserHelperInstance.resetInlineCmp() } `;
    
                if (!v.words) res += '';
                else
                    res += `verb:(${v.words.reduce((p, c)=> (p?p + ' / ': '') + '"' + c + '"', '')}) ${(p.tokens && p.tokens.length > 0)?'_+ ':''}`;
    
                var objs = [];
                var cmps = [];
                try {
                    if (p.tokens) this.unduplicate(p.tokens);
                } catch (error) {
                    throw `Verb ${JSON.stringify(v.words)}: ${error}`
                }
    
                var gen = '';
    
                if (p.tokens) p.tokens.forEach(t => gen += this.generateToken(t, p.action, objs, cmps));
    
                res += ((cmps.length > 0) ? cmps.join(' ') + ' ' : '') + gen;
    
                if (p.reverse) objs = objs.reverse();
    
                const params = `{actor: pgAdvParserHelperInstance.actor(actor), verb: ${Array.isArray(v.words)?'verb':'undefined'}, action: '${p.action}'${objs[0]?', noun: ' + objs[0]: ''}${objs[1]?', second: ' + objs[1]: ''}${v.meta?', meta: true': ''}}`;
    
                res += `& { return pgAdvParserHelperInstance.actionCheck(${params}) } { return pgAdvParserHelperInstance.createAction(${params}) }`
                res += '\n';
            });
            res += '\n'
        });
        
        res = rulesName + ' = \n\t' + res;
        
        return res;
    }
}