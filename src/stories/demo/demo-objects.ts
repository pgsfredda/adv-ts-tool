import { pgAdvLibObject } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib";
import { pgAdvLibStoryDef } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-story-def";

export class demoObjects extends pgAdvLibStoryDef  {
    patate = new pgAdvLibObject({
        ID: 'patate',
        external: 'patate',
        description: 'patate bitorzolute e appetitose',
        name: ['patate', 'tuberi'],
        float: ['esamina', 'prendo', 'mangio'],
    })
};