import { pgAdvLibActionInfo, pgAdvLibMessages } from '../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-defs'
import { getAdvSimpleLink } from '../../app/pg-adv-story/pg-adv-lib/pg-adv-utils';

export class pgAdvDefaultMessages extends pgAdvLibMessages {
    appQuit            = '<b>Arrivederci</b>';
    appQuitWithErrors  = 'adv TS tool fermato con errori: ';
    appInputPlaceholder= 'cosa fai?';
    parseActionNotFound= 'Non comprendo la frase: azione non definita';
    parseNounNotFound  = 'Non comprendo la frase: nome non trovato nell\'ambito specificato';
    parseVerbNotFound  = 'Non comprendo la frase: non conosco il verbo';
    parseNoMeaning     = (data: string) => `Non comprendo la frase (<em>${data}</em>)`;
    parseNotHeld       = (data: string) => `Non possiedi ciò cui ti riferisci (<em>${data}</em>)`;
    parseNotSeen       = (data: string) => `Non vedo ciò cui ti riferisci (<em>${data}</em>)`;
    storyExitsInit     = `Di qui puoi andare verso `;
    storyExitsCurr     = `, `;
    storyObjsInit      = `Qui puoi vedere `;
    storyObjsCurr      = `, `;
    storyExitNoAllowed = (data: string) => `Non puoi andare in quella direzione (<em>${data}</em>)`;
    storyGenericAction = (data: Partial<pgAdvLibActionInfo>) => `Le tue intenzioni sono piuttosto generiche (<em>${data.verb}</em>)`;
}
