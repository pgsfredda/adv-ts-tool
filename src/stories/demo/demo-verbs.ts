import { pgAdvLibVerb } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib";

export const demoVerbs = [
    new pgAdvLibVerb({ name: ['q', 'quit', 'fine'], patterns: [{ action: 'quitAct'}]}),
    new pgAdvLibVerb({ name: ['start'], patterns: [{ action: 'startAct'}]}),
    new pgAdvLibVerb({ name: ['mangio', 'ingurgito'], patterns: [{ action: 'eatAct'}]}),
]