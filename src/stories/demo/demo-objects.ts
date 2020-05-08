import { pgAdvLibObject, pgAdvLibStoryDef } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib";

export class demoObjects extends pgAdvLibStoryDef  {
    patate = new pgAdvLibObject({
        external: 'patate',
        description: 'patate bitorzolute e appetitose',
        name: ['patate', 'tuberi']
    })
};