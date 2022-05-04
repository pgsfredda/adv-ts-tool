import { pgAdvLibVerbList } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-verb-list";

export const pgAdvLibDefaultVerbs = new pgAdvLibVerbList([
    { words: ['quit', 'bye', 'q', 'end'], patterns: [{ action: 'quitAct'}]},
    { words: ['look', 'l'], patterns: [{ tokens:['noun'], action: 'lookAct'}, { action: 'lookAct'}]},
    { words: ['start'], patterns: [{ action: 'startAct'}]}
]);