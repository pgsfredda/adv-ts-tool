import { pgAdvLibRoom } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-room";
import { pgAdvLibStoryDef } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib";

export class demoRooms  extends pgAdvLibStoryDef {
    radura = new pgAdvLibRoom({
        external   : 'Nella radura',
        description: "Un luogo suggestivo circondato da alte betulle.<br>L'erba spontanea è verde e non troppo alta.<br>Nell'aria profumo di bosco.",
        name       : ['radura', 'prato'],
    });

    castle = new pgAdvLibRoom({
        external   : 'Entro le mura del castello',
        description: 'I torrioni e le mura del castello sono davvero imponenti. Senti ancora le urla dei tanti soldati morti nel tentativo di conquistare questa rocca.',
        name       : ['castello']
    });
}