import { pgAdvLibCharacter } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-character";
import { pgAdvLibStoryDef } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-story-def";

export class demoCharacters extends pgAdvLibStoryDef {

    fabia = new pgAdvLibCharacter({
        ID: 'fabia',
        external   : 'La giocatrice',
        description: 'Una vera eroina che non ha paura di riordinare pur di accedere a un nuovo sistema di gestione delle IF.',
        name       : ['fabia'],
    });

    paolo = new pgAdvLibCharacter({
        ID: 'paolo',
        external   : 'Il giocatore',
        description: 'Un vero eroe che non ha paura di addentrarsi nei meandri di un nuovo sistema di gestione delle IF.',
        name       : ['paolo', 'gabriele'],
        attributes : { male: true, light: true }
    });

    player = this.paolo;
}