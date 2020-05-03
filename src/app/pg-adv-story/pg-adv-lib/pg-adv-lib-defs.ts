export enum pgAdvLibExitcode {
    stop,
    continue
}

export type pgAdvLibText = string | string[];

export const pgAdvLinkTag     = 'adv-l';
export const pgAdvLinkCmdAttr = 'cmd';
export const pgAdvLinkEchoAttr = 'echo';

export type pgAdvLibObjectFuncOpts = {};
export type pgAdvLibObjectFunc = (options?: pgAdvLibObjectFuncOpts) => pgAdvLibText;
export type pgAdvLibObjectAttributes = { male?: boolean, female?: boolean, [key: string]: boolean }

export type pgAdvLibPushCmdOpts = {echo?: boolean};
export type pgAdvLibPushCmd = {tokens: string[], options: pgAdvLibPushCmdOpts};

export enum pgAdvLibParsingPhase {
    init,
    verb,
    action,
    noun,
    compass,
    complete
}

export type pgAdvLibActionInfo = { actor?: any, action: any, noun?: any, second?: any, parser?: pgAdvLibParsingPhase};
export type pgAdvLibActionFunc = (info: pgAdvLibActionInfo) => pgAdvLibExitcode;

export enum pgAdvParsingContext {
    noun,
}

export type pgAdvMessages = {
    parseVerbNotFound    : string,
    parseActionNotFound  : string,
    parseNounNotFound    : string,
}
