import { pgAdvLibActionInfo } from "../../pg-adv-lib-defs";
import { pgAdvLibVerbList } from "../../pg-adv-lib-verb-list";

export interface pgAdvParserHelperInterface {

    actionCheck(params: Partial<pgAdvLibActionInfo>): boolean;
    
    createAction(params: Partial<pgAdvLibActionInfo>): {};
    
    resetInlineCmp():boolean;
    
    inlineSkip(w: string):boolean;
    
    setInlineCmp(cmp: string):boolean;
    
    special(special: string): {};
    
    number(number: string): {};
    
    noun(noun: string): {};
    
    held(held: string): {};
    
    topic(topic: string): {};
    
    creature(creature: string): {};
    
    multi(multi: string): {};
    
    multiHeld(multiHeld: string): {};
    
    multiExcept(multiExcept: string): {};
    
    multiInside(multiInside: string): {};
    
    actor(act: any): {};

    compass(noun): {};
}
