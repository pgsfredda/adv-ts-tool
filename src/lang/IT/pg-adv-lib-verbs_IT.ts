import { pgAdvLibVerbList } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-verb-list";

export const pgAdvLibDefaultVerbs = new pgAdvLibVerbList([
    { words: ['quit', 'bye', 'q^^', 'fine'], patterns: [{ action: 'quitAct'}]},
    { words: ['look', 'l^^', 'guarda', 'g^^'], patterns: [{ tokens:['noun'], action: 'lookAct'}, { action: 'lookAct'}]},
    { words: ['start'], patterns: [{ action: 'startAct'}]},
    { patterns: [{ tokens: ['noun=compass'], action: 'goAct'}]},
    { words: ['leone'], patterns: [{ action: 'genAct'}]},
]);