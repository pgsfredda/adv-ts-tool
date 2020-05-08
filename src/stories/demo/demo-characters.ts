import { pgAdvLibCharacter } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-character";
import { pgAdvLibStoryDef } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib";

export const paolo = new pgAdvLibCharacter({
    external   : 'Il giocatore',
    description: 'Un vero eroe che non ha paura di addentrarsi nei meandri di un nuovo sistema di gestione delle IF.',
    name       : ['paolo', 'gabriele'],
    attributes : { male: true, light: true }
});

export const fabia = new pgAdvLibCharacter({
    external   : 'La giocatrice',
    description: 'Una vera eroina che non ha paura di riordinare pur di accedere a un nuovo sistema di gestione delle IF.',
    name       : ['fabia']
});

export class demoCharacters extends pgAdvLibStoryDef {
    player = paolo;
}