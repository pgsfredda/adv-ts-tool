import { pgAdvLibRoom } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-room";
import { getAdvSimpleLink } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-utils";
import { pgAdvLibStoryDef } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-story-def";

export class demoRooms extends pgAdvLibStoryDef {
    radura = new pgAdvLibRoom({
        ID: 'radura',
        external   : 'Nella radura',
        description: [
            "Un luogo suggestivo circondato da alte betulle.",
            "L'erba spontanea è verde e non troppo alta. Nell'aria profumo di bosco.",
            `In fondo alla radura si erge maestosa un'antica ${getAdvSimpleLink('quercia', 'x quercia')}.`
        ],
        name       : ['radura', 'prato'],
        exits      : {
            north: 'castle'
        }
    });

    castle = new pgAdvLibRoom({
        ID: 'castle',
        external   : 'Entro le mura del castello',
        description: 'I torrioni e le mura del castello sono davvero imponenti. \
            Senti ancora le urla dei tanti soldati morti nel tentativo di conquistare questa rocca.',
        name       : ['castello', 'fortezza'],
        exits      : {
            south: this.radura,
            west : 'court',
        }
    });

    court = new pgAdvLibRoom({
        ID: 'court',
        external   : 'Nella corte interna al castello',
        description: 'Un\'ampia corte dove un tempo si riuniva l\'esercito e i cavalieri',
        name       : ['corte', 'piazzale'],
        exits      : {
            east: this.castle
        }
    })
}
