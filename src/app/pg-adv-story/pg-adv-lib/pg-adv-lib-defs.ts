import { pgAdvLibObject } from "./pg-adv-lib-object";

export enum pgAdvLibExitcode {
    stop,
    continue,
    error
}

export type pgAdvHTMLTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
export type pgAdvLibComplexString = {text: string, tag: pgAdvHTMLTag, classes?: string};
export type pgAdvLibString = string | pgAdvLibComplexString;
export type pgAdvLibText =  string | pgAdvLibString | pgAdvLibString[];

export function pgadvLibStringToString(cs: pgAdvLibComplexString) { return cs.text };


export const pgAdvLibLinkTag      = 'adv-l';
export const pgAdvLibLinkCmdAttr  = 'cmd';
export const pgAdvLibLinkEchoAttr = 'echo';
export const pgAdvLibLinkDelAttr  = 'delete';

export type pgAdvLibLinkData = {attr?: string, prompt?: string, cmd?: string | pgAdvLibItemsData[]};
export type pgAdvLibItemsData = {label: string, value: string};

export type pgAdvLibObjectFuncOpts = {};
export type pgAdvLibObjectFunc = (options?: pgAdvLibObjectFuncOpts) => pgAdvLibText;
export type pgAdvLibObjectAttributes = { 
    male?: boolean, 
    female?: boolean, 
    [key: string]: boolean 
}

export type pgAdvLibPushCmdOpts = {
    echo?: boolean
};

export type pgAdvLibPushCmd = {
    sentence: string, 
    options: pgAdvLibPushCmdOpts
};

export type pgAdvLibActionInfo = { 
    actor  : any,
    verb   : any,
    action : any,
    noun   : any,
    second : any,
    options: any;
};

export type pgAdvLibParserResult = {
    sentence: string,
    info : Partial<pgAdvLibActionInfo>,
    warn?: pgAdvLibParserError,
}

export type pgAdvLibActionFunc = (info: Partial<pgAdvLibActionInfo>) => pgAdvLibExitcode;

export type pgAdvParserTokenTypes = 'noun' | 'multi' | 'multiExcept' | 'multiInside' | 'held' | 'multiHeld' | 'creature' | 'number' | 'special' | 'topic';

export enum pgAdvParsingContext {
    noun,
}

export class pgAdvLibMessages {
    appQuit              : string;
    appQuitWithErrors    : string;
    appInputPlaceholder  : string;
    parseVerbNotFound    : string;
    parseActionNotFound  : string;
    parseNounNotFound    : string;
    parseNoMeaning       : ((data: string) => string);
    parseNotHeld         : ((data: string) => string);
    parseNotSeen         : ((data: string) => string);
    storyExitsInit       : string;
    storyExitsCurr       : string;
    storyObjsInit        : string;
    storyObjsCurr        : string;
    storyExitNoAllowed   : ((data: string) => string);
    storyGenericAction   : ((data: Partial<pgAdvLibActionInfo>) => string);
}

export type pgAdvLibCollectionType = 'rooms' | 'objects' | 'verbs' | 'actions' | 'characters';


export type pgAdvLibParserErrorNumber = 'NO_PE' | 'GENERIC_PE' | 'NOTHELD_PE' | 'CANTSEE_PE' | 'NOTHING_PE' | 'VERB_PE' | 'EXCEPT_PE' | 'TOOLIT_PE';

export type pgAdvLibParserErrorValue = {
    actor     : any,
    actionName: string,
    data      : any,
    inside    : any,
    attr      : any,
    verb      : string,
}

export type pgAdvLibParserError = {
    errno: pgAdvLibParserErrorNumber,
    value: Partial<pgAdvLibParserErrorValue>,
}

export type pgAdvLibRoomDescriptionOptions = {
    exits?:boolean, 
    objs?:boolean
}

export const pgAdvLibRoomDescriptionOptionsDefault = {
    exits: true, 
    objs: true,
}