import { pgAdvLibActionInfo } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib";
import { pgAdvDefaultMessages } from "../../lang/IT/pg-adv-lib-messages_IT"; //look at lang tag - IT/EN/...

export class demoMessages extends pgAdvDefaultMessages {
    eatNoFood = 'Sembra tu non abbia mangiato nulla di interessante';
    eatFood   = (info: Partial<pgAdvLibActionInfo>) => `Hai mangiato ${(typeof info.noun === 'string'? info.noun: info.noun.multi)}: ottimo!`;
}