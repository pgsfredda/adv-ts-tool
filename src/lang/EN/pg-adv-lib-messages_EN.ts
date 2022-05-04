import { pgAdvLibActionInfo, pgAdvLibMessages } from '../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-defs'
import { getAdvSimpleLink } from '../../app/pg-adv-story/pg-adv-lib/pg-adv-utils';

export class pgAdvDefaultMessages extends pgAdvLibMessages {
    appQuit            = '<b>Bye bye</b>';
    appQuitWithErrors  = 'adv TS tool stopped with errors: ';
    appInputPlaceholder= 'what do you do?';
    parseActionNotFound= 'Action not found or not defined';
    parseNounNotFound  = 'Noun not found or not defined';
    parseVerbNotFound  = 'Verb not found or not defined';
    parseNoMeaning     = (data: string) => `Sentence meaning not understood (<em>${data}</em>)`;
    parseNotHeld       = (data: string) => `Object/s not held (<em>${data}</em>)`;
    parseNotSeen       = (data: string) => `Object/s not seen (<em>${data}</em>)`;
    storyExitsInit     = `You can go to `;
    storyExitsCurr     = `, `;
    storyObjsInit      = `Here you can see `;
    storyObjsCurr      = `, `;
    storyExitNoAllowed = (data: string) => `You can't go to that direction (<em>${data}</em>)`;
    storyGenericAction = (data: Partial<pgAdvLibActionInfo>) => `Your intentions are quite general (<em>${data.verb}</em>)`;
}

