import { pgAdvLibLinkTag, pgAdvLibLinkData, pgAdvLibLinkCmdAttr, pgAdvLibLinkDelAttr, pgAdvLibItemsData } from "./pg-adv-lib-defs";

/**
 * @description Function to allow one JavaScript file to be included by another.
 * @function
 * @param {string} jsFile the javascript source file name
 * @param {string} [jsCond] the html condition string given in <!--[if]> ... <![endif]--> tags source file name
 * 
 * @copyright Copyright (C) 2006-2008, by cryer
 * @author Cryer
 * @see {@link http://www.cryer.co.uk|www.cryer.co.uk} 
 */
 export function includeJS (jsFile: string, jsCond?: string) {
    if (jsCond) document.write('<!--[if ' + jsCond + ']>');
    document.write('<script type="text/javascript" src="' + jsFile + '"></script>');
    if (jsCond) document.write('<![endif]-->');
};

/**
 * Get as string the obj's property name
 *
 * @param {Object} obj the object property's parent
 * @param {*} prop the obj's propery
 * @returns a string if the property is in the obj's prototype definition. *undefined* otherwise
 * @example
 * let a = this.rooms.castle;
 * console.log(getPropName(this.rooms, a)); //'castle'
 */
export function getPropName(obj:Object, prop) {
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            const element = obj[k];
            if(element === prop) return k;
        }
    }

    return undefined;
}

export function getAdvLink(prompt: string, tag: string = pgAdvLibLinkTag, opts?: pgAdvLibLinkData[]) {
    let res: string = '';

    res = '<' + tag;
    if(opts) res += opts.reduce((prev, curr)=> { return prev + ' ' + curr.attr + '=\'' + (Array.isArray(curr.cmd)?JSON.stringify(curr.cmd):curr.cmd) + '\''}, '');
    res += '>' + prompt + '</' + tag + '>';

    return res;
}

export function getAdvSimpleLink(prompt: string, command?: string | pgAdvLibItemsData[]) {
    if(!command) command = prompt;
    
    let tmp: pgAdvLibLinkData = { attr: pgAdvLibLinkCmdAttr, cmd: command };

    return getAdvLink(prompt, pgAdvLibLinkTag, [tmp]);
}

