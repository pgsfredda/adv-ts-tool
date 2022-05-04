import { pgAdvLibVerbList } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-verb-list";

export const demoVerbs = new pgAdvLibVerbList([
    { words: ['mangio', 'ingurgito'], patterns: [{ tokens:['multiHeld'], action: 'eatAct'}, { action: 'eatAct'}]},
]);