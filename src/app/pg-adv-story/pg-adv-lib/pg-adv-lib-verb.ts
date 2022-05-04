export type pgAdvLibPattern = {
    tokens?    : Array<string>; 
    action     : string;
    reverse?   : boolean;
}
export type pgAdvLibVerb = {
    meta?       : boolean;
    words?       : Array<string>;
    patterns?   : Array<pgAdvLibPattern>;
}
