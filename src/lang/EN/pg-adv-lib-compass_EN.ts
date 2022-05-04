import { pgAdvLibCompass } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-compass";


export class pgAdvDefaultCompass extends pgAdvLibCompass {
    values = {
        north    : ['north', 'n^^'],
        south    : ['south', 's^^'],
        east     : ['east', 'e^^'],
        west     : ['west', 'w^^'],
        northeast: ['northeast', 'ne^'],
        northwest: ['northwest', 'nw^'],
        southeast: ['southeast', 'se^'],
        southwest: ['southwest', 'sw^'],
        up       : ['up^'],
        down     : ['down', 'dn^'],
        into     : ['into', 'in^'],
        outto    : ['outto', 'out'],
    }
}